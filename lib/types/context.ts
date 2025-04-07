import type { User } from '@supabase/supabase-js';
import { HabitStack } from './database';

export interface HabitContextType {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  habitStacks: HabitStack[];
  completedToday: Record<string, boolean>;
  user: User | null;
  // ... other methods ...
} 