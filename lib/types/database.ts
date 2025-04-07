export type Profile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type HabitStack = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type Habit = {
  id: string;
  stack_id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_type?: 'time' | 'habit';
  trigger_habit_id?: string;
  created_at: string;
  updated_at: string;
};

export type Completion = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      habit_stacks: {
        Row: HabitStack;
        Insert: Omit<HabitStack, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HabitStack, 'id' | 'user_id'>>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Habit, 'id' | 'user_id'>>;
      };
      completions: {
        Row: Completion;
        Insert: Omit<Completion, 'id' | 'created_at'>;
        Update: never; // Completions should not be updated, only created/deleted
      };
    };
  };
}; 