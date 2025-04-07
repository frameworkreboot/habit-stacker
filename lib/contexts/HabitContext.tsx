"use client"

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Habit, HabitStack } from '../types';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';
import type { User } from '@supabase/supabase-js';
import {
  getHabitStacks,
  getHabits,
  createHabitStack,
  updateHabitStack,
  deleteHabitStack,
  createHabit,
  updateHabit as updateSupabaseHabit,
  deleteHabit as deleteSupabaseHabit,
  toggleHabitCompletion as toggleSupabaseHabitCompletion,
  getCompletions
} from '@/lib/api/supabase-habits';
import { supabase } from '@/lib/supabase';

// Define the shape of our context
type HabitContextType = {
  habits: Habit[];
  stacks: HabitStack[];
  completedToday: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  toggleHabitCompletion: (habitId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  addStack: (stack: Omit<HabitStack, 'id'>) => Promise<void>;
  updateStack: (stack: HabitStack) => Promise<void>;
  deleteStack: (stackId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  isHabitCompleted: (habitId: string) => boolean;
  isHabitCompletedOnDate: (habitId: string, date: string) => boolean;
  getCompletedHabitsForRange: (startDate: Date, endDate: Date) => Habit[];
  user: User | null;
};

// Create the context with a default value
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Update the interface for completed habits to include dates
interface CompletedHabit {
  id: string;
  date: string; // ISO date string
}

// Add environment check utility
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Provider component
export function HabitProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stacks, setStacks] = useState<HabitStack[]>([]);
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Add auth state tracking
  const [userState, setUserState] = useState<User | null>(null);

  // Listen for auth changes
  useEffect(() => {
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUserState(session?.user ?? null);
        if (session?.user) {
          await loadData(session.user.id);
        } else {
          // Clear data when logged out
          setStacks([]);
          setCompletedToday({});
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserState(session?.user ?? null);
      if (session?.user) {
        loadData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async (userId: string) => {
    try {
      if (!supabase) return;
      
      setIsLoading(true);
      setError(null);

      // First check if the profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError || !profileData) {
        // Create profile if it doesn't exist
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user?.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          return;
        }
      }
      
      // Now that profile exists, load habit stacks
      const { data: stacksData, error: stacksError } = await supabase
        .from('habit_stacks')
        .select('*')
        .eq('user_id', userId);

      if (stacksError) throw stacksError;

      // If new user, create default habit stack
      if (!stacksData || stacksData.length === 0) {
        const defaultStack = {
          user_id: userId,
          name: 'My First Stack',
          description: 'Getting started with habits'
        };

        const { data: newStack, error: createError } = await supabase
          .from('habit_stacks')
          .insert(defaultStack)
          .select()
          .single();

        if (createError) throw createError;
        setStacks(newStack ? [newStack] : []);
      } else {
        setStacks(stacksData);
      }

      // Load today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completions, error: completionsError } = await supabase
        .from('completions')
        .select('habit_id')
        .eq('user_id', userId)
        .eq('completed_date', today);

      if (completionsError) throw completionsError;

      const completionsMap = completions?.reduce((acc, completion) => ({
        ...acc,
        [completion.habit_id]: true
      }), {});

      setCompletedToday(completionsMap || {});
      setIsInitialized(true);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load habit data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataFromSupabase = async () => {
    try {
      // Get habit stacks
      const stacksData = await getHabitStacks();
      setStacks(stacksData);
      
      // Get all habits
      const habitsData = await getHabits();
      setHabits(habitsData);
      
      // Get completions for today
      const today = new Date().toISOString().split('T')[0];
      const completions = await getCompletions('', today, today);
      
      // Format completions to match our CompletedHabit interface
      const formattedCompletions: CompletedHabit[] = completions.map(completion => ({
        id: completion.habit_id,
        date: completion.completed_date
      }));
      
      setCompletedToday(formattedCompletions.reduce((acc, completion) => ({
        ...acc,
        [completion.id]: true
      }), {}));
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }
  };

  // Load data from localStorage
  const loadDataFromLocalStorage = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedStacks = localStorage.getItem('habitStacks');
      const storedCompletedHabits = localStorage.getItem('completedToday');
      
      // Extract habits from stacks
      if (storedStacks) {
        const stacks = JSON.parse(storedStacks);
        setStacks(stacks);
        
        // Extract all habits from all stacks
        const allHabits: Habit[] = [];
        stacks.forEach((stack: HabitStack) => {
          allHabits.push(...stack.habits);
        });
        setHabits(allHabits);
      }
      
      if (storedCompletedHabits) {
        try {
          const parsedHabits = JSON.parse(storedCompletedHabits);
          
          // Handle migration from old format (array of strings) to new format (array of objects)
          const migratedHabits = Array.isArray(parsedHabits) 
            ? parsedHabits.map(item => {
                if (typeof item === 'string') {
                  // Convert old format to new format
                  return { id: item, date: new Date().toISOString().split('T')[0] };
                }
                return item;
              })
            : [];
          
          setCompletedToday(migratedHabits.reduce((acc, completion) => ({
            ...acc,
            [completion.id]: true
          }), {}));
        } catch (e) {
          console.error('Error parsing completed habits:', e);
          setCompletedToday({});
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      throw error;
    }
  };

  // Save data to localStorage (only when not logged in)
  useEffect(() => {
    if (!isInitialized || userState) return;
    
    try {
      // Update stacks in localStorage
      localStorage.setItem('habitStacks', JSON.stringify(stacks));
      
      // Update completed habits
      localStorage.setItem('completedToday', JSON.stringify(Object.keys(completedToday)));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [stacks, completedToday, isInitialized, userState]);

  // Toggle habit completion
  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (userState) {
        // Use Supabase
        const isNowCompleted = await toggleSupabaseHabitCompletion(habitId, today);
        
        // Update local state to match
        setCompletedToday(prev => ({
          ...prev,
          [habitId]: isNowCompleted
        }));
      } else {
        // Use localStorage
        setCompletedToday(prev => ({
          ...prev,
          [habitId]: !prev[habitId]
        }));
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      setError('Failed to update habit completion. Please try again.');
    }
  };

  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = useCallback((habitId: string, date: string) => {
    return completedToday[habitId];
  }, [completedToday]);

  // Check if a habit is completed today
  const isHabitCompleted = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return isHabitCompletedOnDate(habitId, today);
  }, [isHabitCompletedOnDate]);

  // Get completed habits for a date range
  const getCompletedHabitsForRange = useCallback((startDate: Date, endDate: Date) => {
    // Format dates consistently using year/month/day
    const formattedStartDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    ).toISOString().split('T')[0];
    
    const formattedEndDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    ).toISOString().split('T')[0];
    
    return habits.filter(habit => {
      const habitDate = habit.createdAt;
      return habitDate >= formattedStartDate && habitDate <= formattedEndDate;
    });
  }, [habits]);

  // CRUD operations for habits
  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    try {
      if (userState) {
        // Use Supabase
        const newHabit = await createHabit({
          ...habit,
          user_id: userState.id
        });
        
        // Update local state
        setHabits(prev => [...prev, newHabit]);
        
        // Find the stack to add the habit to and update it
        const targetStackId = (habit as any).stack_id;
        if (targetStackId) {
          const targetStack = stacks.find(s => s.id === targetStackId);
          if (targetStack) {
            setStacks(prev => prev.map(s => {
              if (s.id === targetStackId) {
                return {
                  ...s,
                  habits: [...s.habits, newHabit]
                };
              }
              return s;
            }));
          }
        }
      } else {
        // Use localStorage
        const newHabit = {
          ...habit,
          id: `habit-${Date.now()}`,
          date: new Date().toISOString().split('T')[0]
        };
        
        // Update local state
        setHabits(prev => [...prev, newHabit]);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
    }
  };

  // Update habit
  const updateHabit = async (habit: Habit) => {
    try {
      if (userState) {
        // Use Supabase
        const updatedHabit = await updateSupabaseHabit(habit.id, habit);
        
        // Update local state
        setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
        
        // Find the stack to update and update it
        const targetStackId = (habit as any).stack_id;
        if (targetStackId) {
          const targetStack = stacks.find(s => s.id === targetStackId);
          if (targetStack) {
            setStacks(prev => prev.map(s => {
              if (s.id === targetStackId) {
                return {
                  ...s,
                  habits: s.habits.map(h => h.id === updatedHabit.id ? updatedHabit : h)
                };
              }
              return s;
            }));
          }
        }
      } else {
        // Use localStorage
        setHabits(prev => prev.map(h => h.id === habit.id ? habit : h));
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
    }
  };

  // Delete habit
  const deleteHabit = async (habitId: string) => {
    try {
      if (userState) {
        // Use Supabase
        await deleteSupabaseHabit(habitId);
        
        // Update local state
        setHabits(prev => prev.filter(h => h.id !== habitId));
        
        // Find the stack to update and update it
        const habitToDelete = habits.find(h => h.id === habitId);
        const targetStackId = habitToDelete?.stack_id;
        if (targetStackId) {
          const targetStack = stacks.find(s => s.id === targetStackId);
          if (targetStack) {
            setStacks(prev => prev.map(s => {
              if (s.id === targetStackId) {
                return {
                  ...s,
                  habits: s.habits.filter(h => h.id !== habitId)
                };
              }
              return s;
            }));
          }
        }
      } else {
        // Use localStorage
        setHabits(prev => prev.filter(h => h.id !== habitId));
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit. Please try again.');
    }
  };

  // CRUD operations for stacks
  const addStack = async (stack: Omit<HabitStack, 'id'>) => {
    try {
      if (userState) {
        // Use Supabase
        const newStack = await createHabitStack(stack);
        
        // Update local state
        setStacks(prev => [...prev, newStack]);
      } else {
        // Use localStorage
        const newStack = {
          ...stack,
          id: `stack-${Date.now()}`
        };
        
        // Update local state
        setStacks(prev => [...prev, newStack]);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error adding stack:', error);
      setError('Failed to add stack. Please try again.');
    }
  };

  // Update stack
  const updateStack = async (stack: HabitStack) => {
    try {
      if (userState) {
        // Use Supabase
        const updatedStack = await updateHabitStack(stack.id, stack);
        
        // Update local state
        setStacks(prev => prev.map(s => s.id === updatedStack.id ? updatedStack : s));
      } else {
        // Use localStorage
        setStacks(prev => prev.map(s => s.id === stack.id ? stack : s));
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error updating stack:', error);
      setError('Failed to update stack. Please try again.');
    }
  };

  // Delete stack
  const deleteStack = async (stackId: string) => {
    try {
      if (userState) {
        // Use Supabase
        await deleteHabitStack(stackId);
        
        // Update local state
        setStacks(prev => prev.filter(s => s.id !== stackId));
      } else {
        // Use localStorage
        setStacks(prev => prev.filter(s => s.id !== stackId));
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('habitStacks', JSON.stringify(stacks));
          localStorage.setItem('completedToday', JSON.stringify(completedToday));
        }
      }
    } catch (error) {
      console.error('Error deleting stack:', error);
      setError('Failed to delete stack. Please try again.');
    }
  };

  // Refresh habits
  const refreshHabits = async () => {
    try {
      if (userState) {
        await fetchDataFromSupabase();
      } else {
        await loadDataFromLocalStorage();
      }
    } catch (error) {
      console.error('Error refreshing habits:', error);
      setError('Failed to refresh habits. Please try again.');
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        stacks,
        completedToday,
        isLoading,
        error,
        toggleHabitCompletion,
        addHabit,
        updateHabit,
        deleteHabit,
        addStack,
        updateStack,
        deleteStack,
        refreshHabits,
        isHabitCompleted,
        isHabitCompletedOnDate,
        getCompletedHabitsForRange,
        user: userState
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

// Hook for using the context
export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}