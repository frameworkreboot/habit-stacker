import { supabase } from '@/lib/supabase';
import { Habit, HabitStack } from '@/lib/types';

// Habit Stacks API
export async function getHabitStacks() {
  const { data, error } = await supabase
    .from('habit_stacks')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as HabitStack[];
}

export async function createHabitStack(stack: Omit<HabitStack, 'id'>) {
  const { data, error } = await supabase
    .from('habit_stacks')
    .insert(stack)
    .select()
    .single();
  
  if (error) throw error;
  return data as HabitStack;
}

export async function updateHabitStack(id: string, stack: Partial<HabitStack>) {
  const { data, error } = await supabase
    .from('habit_stacks')
    .update(stack)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as HabitStack;
}

export async function deleteHabitStack(id: string) {
  const { error } = await supabase
    .from('habit_stacks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Habits API
export async function getHabits(stackId?: string) {
  let query = supabase.from('habits').select('*');
  
  if (stackId) {
    query = query.eq('stack_id', stackId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Habit[];
}

export async function createHabit(habit: Omit<Habit, 'id'>) {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();
  
  if (error) throw error;
  return data as Habit;
}

export async function updateHabit(id: string, habit: Partial<Habit>) {
  const { data, error } = await supabase
    .from('habits')
    .update(habit)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Habit;
}

export async function deleteHabit(id: string) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Completions API
export async function getCompletions(habitId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('completions')
    .select('*')
    .eq('habit_id', habitId)
    .gte('completed_date', startDate)
    .lte('completed_date', endDate);
  
  if (error) throw error;
  return data;
}

export async function toggleHabitCompletion(habitId: string, date: string) {
  // First check if the completion exists
  const { data: existing } = await supabase
    .from('completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('completed_date', date)
    .maybeSingle();
  
  if (existing) {
    // Delete the completion if it exists
    const { error } = await supabase
      .from('completions')
      .delete()
      .eq('id', existing.id);
    
    if (error) throw error;
    return false; // Return false to indicate habit is now incomplete
  } else {
    // Create a new completion
    const { error } = await supabase
      .from('completions')
      .insert({
        habit_id: habitId,
        completed_date: date
      });
    
    if (error) throw error;
    return true; // Return true to indicate habit is now complete
  }
} 