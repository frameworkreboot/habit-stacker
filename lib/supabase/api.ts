import { supabase } from './client';
import type { HabitStack, Habit, Completion } from '../types/database';

export const habitApi = {
  // Habit Stacks
  async getHabitStacks() {
    const { data, error } = await supabase
      .from('habit_stacks')
      .select('*')
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async createHabitStack(stack: Omit<HabitStack, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('habit_stacks')
      .insert(stack)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Habits
  async getHabits(stackId: string) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('stack_id', stackId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Completions
  async getCompletions(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('completions')
      .select('*')
      .gte('completed_date', startDate)
      .lte('completed_date', endDate);
    if (error) throw error;
    return data;
  },

  async toggleCompletion(habitId: string, date: string, userId: string) {
    // First check if completion exists
    const { data: existing } = await supabase
      .from('completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completed_date', date)
      .single();

    if (existing) {
      // Delete if exists
      const { error } = await supabase
        .from('completions')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return null;
    } else {
      // Create if doesn't exist
      const { data, error } = await supabase
        .from('completions')
        .insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: date
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // User Productivity Statistics
  async getUserProductivityStats(userId: string, startDate: string, endDate: string) {
    // Count total habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', userId);
    
    if (habitsError) throw habitsError;
    
    // Count completions in date range
    const { data: completions, error: completionsError } = await supabase
      .from('completions')
      .select('id, habit_id, completed_date')
      .eq('user_id', userId)
      .gte('completed_date', startDate)
      .lte('completed_date', endDate);
    
    if (completionsError) throw completionsError;
    
    // Count distinct dates with completions
    const activeDays = new Set(completions?.map(c => c.completed_date) || []).size;
    
    // Count completions per habit
    const completionsPerHabit: Record<string, number> = {};
    habits?.forEach(habit => {
      completionsPerHabit[habit.id] = 0;
    });
    
    completions?.forEach(completion => {
      if (completionsPerHabit[completion.habit_id] !== undefined) {
        completionsPerHabit[completion.habit_id]++;
      }
    });
    
    // Calculate streaks
    const dateToCompletions: Record<string, string[]> = {};
    completions?.forEach(completion => {
      if (!dateToCompletions[completion.completed_date]) {
        dateToCompletions[completion.completed_date] = [];
      }
      dateToCompletions[completion.completed_date].push(completion.habit_id);
    });
    
    // Sort dates and calculate current streak
    const sortedDates = Object.keys(dateToCompletions).sort();
    let currentStreak = 0;
    
    if (sortedDates.length > 0) {
      // Check if the most recent completion was today or yesterday
      const lastCompletionDate = new Date(sortedDates[sortedDates.length - 1]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isRecentCompletion = 
        lastCompletionDate.getTime() === today.getTime() || 
        lastCompletionDate.getTime() === yesterday.getTime();
      
      if (isRecentCompletion) {
        currentStreak = 1; // Start with 1 for the most recent day
        
        // Count consecutive days backwards
        for (let i = sortedDates.length - 2; i >= 0; i--) {
          const currentDate = new Date(sortedDates[i]);
          const prevDate = new Date(sortedDates[i + 1]);
          
          // Check if days are consecutive
          const dayDiff = Math.floor(
            (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    return {
      totalHabits: habits?.length || 0,
      totalCompletions: completions?.length || 0,
      activeDays,
      currentStreak,
      completionsPerHabit
    };
  }
}; 