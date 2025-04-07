"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3, Calendar, Clock, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HabitStack } from "@/lib/types"
import { useHabits } from "@/lib/contexts/HabitContext"

export default function StackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stackId = params.id as string
  const { stacks, completedHabits } = useHabits()
  
  const [stack, setStack] = useState<HabitStack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundStack = stacks.find((s) => s.id === stackId)

    if (foundStack) {
      setStack(foundStack)
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }, [stackId, router, stacks])

  if (loading || !stack) {
    return (
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-6 w-full bg-muted rounded"></div>
          <div className="h-[400px] w-full bg-muted rounded"></div>
        </div>
      </main>
    )
  }

  const completionRate =
    stack.habits.length > 0
      ? Math.round((stack.habits.filter((h) => completedHabits.includes(h.id)).length / stack.habits.length) * 100)
      : 0

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{stack.name}</h1>
            <p className="text-muted-foreground mt-1">
              {stack.habits.length} habits • {completionRate}% completed today
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/stacks/edit/${stack.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Stack
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/habits/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Habit Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stack.habits.map((habit, index) => (
                  <div key={habit.id} className="relative">
                    {index > 0 && <div className="absolute left-4 -top-6 h-6 w-0.5 bg-muted-foreground/20"></div>}
                    <div className="flex gap-4">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                          completedHabits.includes(habit.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{habit.name}</h3>
                              {habit.description && (
                                <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {habit.duration} min
                            </Badge>
                          </div>
                          <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                            <span>Trigger: {habit.trigger}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs bg-muted/50 border border-dashed border-muted-foreground/30">
                    <Plus className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1">
                    <Link href="/habits/new">
                      <div className="bg-muted/50 p-4 rounded-lg border border-dashed border-muted-foreground/30 text-center text-muted-foreground hover:bg-muted transition-colors">
                        Add another habit to this stack
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stack Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Total Duration</span>
                    <span className="font-medium">{stack.habits.reduce((acc, h) => acc + h.duration, 0)} min</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Streak</span>
                    <span className="font-medium">
                      {stack.habits.length > 0
                        ? Math.round(stack.habits.reduce((acc, h) => acc + h.streak, 0) / stack.habits.length)
                        : 0}{" "}
                      days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">{completionRate}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Best Performing Habit</h4>
                  {stack.habits.length > 0 ? (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="font-medium">{[...stack.habits].sort((a, b) => b.streak - a.streak)[0].name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {[...stack.habits].sort((a, b) => b.streak - a.streak)[0].streak} day streak
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No habits in this stack yet</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span>Stack habits in a logical sequence</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span>Keep each habit under 2 minutes</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span>Use clear triggers from existing routines</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <span>Celebrate completing your habit chain</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

