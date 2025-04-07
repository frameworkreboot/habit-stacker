import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import HabitStacks from "@/components/habit-stacks"
import { ProgressSummary } from '@/components/progress-summary'
import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "../../components/site-header"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track and manage your habit stacks</p>
          </div>
          <Link href="/habits/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Habit
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Habit Stacks</h2>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <HabitStacks />
              </Suspense>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Progress</h2>
              <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                <ProgressSummary />
              </Suspense>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li>• Start with habits that take less than 2 minutes</li>
                  <li>• Connect new habits to existing routines</li>
                  <li>• Celebrate small wins consistently</li>
                  <li>• Focus on consistency over perfection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

