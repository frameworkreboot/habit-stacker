"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import type { Habit, HabitStack } from "@/lib/types"
import { SiteHeader } from "@/components/site-header"
import { useHabits } from "@/lib/contexts/HabitContext"

export default function NewHabitPage() {
  const router = useRouter()
  const { stacks, addHabit, addStack, updateStack } = useHabits()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(1)
  const [trigger, setTrigger] = useState("")
  const [stack, setStack] = useState("Morning Routine")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !trigger) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (duration > 2) {
      toast({
        title: "Duration too long",
        description: "Habits should take 2 minutes or less for best results",
        variant: "destructive",
      })
      return
    }

    // Create new habit
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      description,
      duration,
      trigger,
      createdAt: new Date().toISOString(),
      streak: 0,
    }

    // Find if the selected stack exists
    const targetStack = stacks.find((s: HabitStack) => s.name === stack)

    if (targetStack) {
      // Add habit to existing stack
      updateStack({
        ...targetStack,
        habits: [...targetStack.habits, newHabit]
      })
    } else {
      // Create new stack
      const newStack: HabitStack = {
        id: `stack-${Date.now()}`,
        name: stack,
        habits: [newHabit],
      }

      addStack(newStack)
    }

    toast({
      title: "Habit created",
      description: "Your new habit has been added to your stack",
    })

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Create a New Habit</h1>
          <p className="text-muted-foreground mt-1">Start small with a habit that takes 2 minutes or less</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Habit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Drink water, Do pushups"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your habit in more detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (2 minutes max)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="duration"
                    min={1}
                    max={5}
                    step={1}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{duration} min</span>
                  </div>
                </div>
                {duration > 2 && (
                  <p className="text-xs text-amber-500 mt-1">Tip: Habits under 2 minutes are more likely to stick</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger (When will you do this?)</Label>
                <Input
                  id="trigger"
                  placeholder="e.g., After brushing teeth, Before lunch"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Connect this habit to an existing routine or another habit
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stack">Add to Stack</Label>
                <div className="flex gap-2">
                  <Input
                    id="stack"
                    placeholder="e.g., Morning Routine"
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit">Create Habit</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

