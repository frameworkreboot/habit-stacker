"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, ChevronRight, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { HabitStack } from "@/lib/types"
import { getLocalData, saveLocalData } from "@/lib/local-storage"
import { useHabits } from "@/lib/contexts/HabitContext"

export default function HabitStacks() {
  const { 
    habits, 
    stacks, 
    isHabitCompleted,
    toggleHabitCompletion,
    deleteHabit,
    deleteStack 
  } = useHabits();

  if (stacks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">You haven't created any habit stacks yet</p>
        <Link href="/habits/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Habit
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {stacks.map((stack) => (
        <Card key={stack.id} className="overflow-hidden">
          <div className="bg-primary/10 px-4 py-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{stack.name}</h3>
              <Badge variant="outline">{stack.habits.length} habits</Badge>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="divide-y">
              {stack.habits.map((habit, index) => (
                <div
                  key={habit.id}
                  className={cn("p-4 flex items-start gap-3", isHabitCompleted(habit.id) && "bg-primary/5")}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      isHabitCompleted(habit.id) && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => toggleHabitCompletion(habit.id)}
                  >
                    {isHabitCompleted(habit.id) ? <Check className="h-4 w-4" /> : <span className="h-4 w-4" />}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-sm text-muted-foreground">{habit.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Open menu</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/habits/edit/${habit.id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-2 flex items-center text-sm">
                      <Badge variant="secondary" className="mr-2">
                        {habit.duration} min
                      </Badge>
                      <div className="flex items-center text-muted-foreground">
                        <span>Trigger: {habit.trigger}</span>
                        {habit.streak > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {habit.streak} day streak
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              {stack.habits.filter(h => isHabitCompleted(h.id)).length} of {stack.habits.length}{" "}
              completed today
            </div>
            <Link href={`/stacks/${stack.id}`}>
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}