export interface Habit {
  id: string
  name: string
  description?: string
  duration: number // in minutes
  trigger: string
  createdAt: string
  streak: number
  user_id?: string
  stack_id?: string
}

export interface HabitStack {
  id: string
  name: string
  description?: string
  habits: Habit[]
  user_id?: string
}

