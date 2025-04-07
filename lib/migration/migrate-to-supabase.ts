import { supabase } from '@/lib/supabase';
import { Habit, HabitStack } from '@/lib/types';

export async function migrateLocalStorageToSupabase() {
  try {
    // Get data from localStorage
    const habitStacksJson = localStorage.getItem('habitStacks');
    const completedTodayJson = localStorage.getItem('completedToday');
    
    if (!habitStacksJson) {
      return { success: true, message: 'No data to migrate' };
    }
    
    const habitStacks: HabitStack[] = JSON.parse(habitStacksJson);
    const completedToday: Record<string, boolean> = completedTodayJson 
      ? JSON.parse(completedTodayJson) 
      : {};
    
    // Get current date for completions
    const today = new Date().toISOString().split('T')[0];
    
    // Start migration transaction
    // First create all stacks
    for (const stack of habitStacks) {
      const { data: newStack, error: stackError } = await supabase
        .from('habit_stacks')
        .insert({
          name: stack.name,
          description: stack.description || '',
        })
        .select()
        .single();
      
      if (stackError) throw stackError;
      
      // Then create all habits for this stack
      for (const habit of stack.habits || []) {
        const { data: newHabit, error: habitError } = await supabase
          .from('habits')
          .insert({
            name: habit.name,
            description: habit.description || '',
            trigger: habit.trigger || '',
            stack_id: newStack.id,
          })
          .select()
          .single();
        
        if (habitError) throw habitError;
        
        // Check if this habit was completed today
        const habitKey = habit.id.toString();
        if (completedToday[habitKey]) {
          const { error: completionError } = await supabase
            .from('completions')
            .insert({
              habit_id: newHabit.id,
              completed_date: today,
            });
          
          if (completionError) throw completionError;
        }
      }
    }
    
    return { 
      success: true, 
      message: 'Migration completed successfully' 
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return { 
      success: false, 
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
} 