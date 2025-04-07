"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StreakVisualization } from './streak-visualization';
import { useHabits } from '@/lib/contexts/HabitContext';

export function ProgressSummary() {
  const { stacks, completedToday } = useHabits();
  
  // Count total habits
  const totalHabits = stacks.reduce((acc: number, stack: any) => 
    acc + stack.habits.length, 0);
  
  // Get today's date as string
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
  
  // Count unique completed habits for today
  const uniqueCompletedHabits = new Set(
    completedToday
      .filter((habit: any) => habit.date === today)
      .map((habit: any) => habit.id)
  );
  const completedHabitsCount = uniqueCompletedHabits.size;
  
  // Calculate completion percentage
  const completionPercentage = totalHabits > 0 
    ? Math.round((completedHabitsCount / totalHabits) * 100) 
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">
              {completedHabitsCount}/{totalHabits}
            </h3>
            <p className="text-muted-foreground">habits completed</p>
          </div>
          <div className="text-3xl font-bold">
            {completionPercentage}%
          </div>
        </div>
        
        <StreakVisualization />
      </CardContent>
    </Card>
  );
}

