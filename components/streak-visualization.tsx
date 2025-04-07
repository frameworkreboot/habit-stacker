import React, { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useHabits } from '@/lib/contexts/HabitContext';
import { cn } from '@/lib/utils';

interface StreakVisualizationProps {
  className?: string;
}

export function StreakVisualization({ className }: StreakVisualizationProps) {
  const { stacks, getCompletedHabitsForRange } = useHabits();
  
  // Calculate the start of the current week (Sunday)
  const startOfCurrentWeek = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 0 }), []);
  
  // Generate an array of dates for the current week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startOfCurrentWeek, i);
      return {
        date,
        dayName: format(date, 'EEE'), // Mon, Tue, etc.
        dayNumber: format(date, 'd'), // 1, 2, etc.
        formattedDate: format(date, 'yyyy-MM-dd')
      };
    });
  }, [startOfCurrentWeek]);
  
  // Count all habits across all stacks
  const totalHabitsCount = useMemo(() => {
    return stacks.reduce((total: number, stack: any) => total + stack.habits.length, 0);
  }, [stacks]);
  
  // Calculate completion status for each day of the week
  const weekProgress = useMemo(() => {
    return weekDays.map(day => {
      // Get completed habits for this specific day
      const completedOnDate = getCompletedHabitsForRange(day.date, day.date);
      
      // Count unique completed habits for this day
      const uniqueHabitIds = new Set(completedOnDate.map((habit: any) => habit.id));
      const completedCount = uniqueHabitIds.size;
      
      // Calculate completion percentage
      const percentage = totalHabitsCount > 0 
        ? Math.round((completedCount / totalHabitsCount) * 100) 
        : 0;
        
      // Determine streak status - only color days on or before today
      let streakStatus = 'none';
      
      // Get the current date (today) for comparison
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
      
      // Only apply color status for days that are on or before today
      if (dayDate <= today) {
        if (percentage === 100) {
          streakStatus = 'complete';
        } else if (percentage > 0) {
          streakStatus = 'partial';
        }
      }
      
      // Check if this day is today
      const isToday = today.getTime() === dayDate.getTime(); // Compare timestamps for more precise equality
      
      return {
        ...day,
        completedCount,
        totalHabitsCount,
        percentage,
        streakStatus,
        isToday
      };
    });
  }, [weekDays, stacks, totalHabitsCount, getCompletedHabitsForRange]);
  
  return (
    <div className={cn("flex items-center justify-between gap-1 mb-6", className)}>
      {weekProgress.map((day, index) => (
        <div key={day.formattedDate} className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground font-medium">
            {day.dayName}
          </div>
          <div 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mt-1 text-xs font-medium",
              day.isToday && "border-2 border-primary",
              day.streakStatus === 'complete' && "bg-green-500 text-white",
              day.streakStatus === 'partial' && "bg-amber-400 text-white",
              day.streakStatus === 'none' && "bg-muted"
            )}
          >
            {day.dayNumber}
          </div>
          <div className="text-xs mt-1 font-mono">
            {day.percentage}%
          </div>
        </div>
      ))}
    </div>
  );
} 