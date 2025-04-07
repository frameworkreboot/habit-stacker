"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import type { Habit } from "@/lib/types"
import { useHabits } from "@/lib/contexts/HabitContext"
import { SiteHeader } from "../../../../components/site-header"

export default function EditHabitPage() {
  const router = useRouter()
  const params = useParams()
  const habitId = params.id as string
  const { habits, stacks, updateHabit } = useHabits()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(1)
  const [trigger, setTrigger] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null)

  useEffect(() => {
    // Find the habit in our context
    const foundHabit = habits.find(h => h.id === habitId)

    if (foundHabit) {
      setCurrentHabit(foundHabit)
      setName(foundHabit.name)
      setDescription(foundHabit.description || "")
      setDuration(foundHabit.duration)
      setTrigger(foundHabit.trigger)
    } else {
      toast({
        title: "Habit not found",
        description: "The habit you're trying to edit doesn't exist",
        variant: "destructive",
      })
      router.push("/dashboard")
    }

    setLoading(false)
  }, [habitId, router, habits])

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

    if (!currentHabit) {
      toast({
        title: "Error",
        description: "Cannot update a non-existent habit",
        variant: "destructive",
      })
      return
    }

    // Update the habit with new values
    const updatedHabit = {
      ...currentHabit,
      name,
      description,
      duration,
      trigger,
    }

    // Update the habit in our context
    updateHabit(updatedHabit)

    toast({
      title: "Habit updated",
      description: "Your habit has been updated successfully",
    })

    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-6 w-full bg-muted rounded"></div>
            <div className="h-[400px] w-full bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Edit Habit</h1>
          <p className="text-muted-foreground mt-1">Update your habit details</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Habit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
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
                <Input id="trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} required />
                <p className="text-xs text-muted-foreground">
                  Connect this habit to an existing routine or another habit
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

