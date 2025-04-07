"use client";

import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "../components/site-header"
import { useHabit } from '@/lib/contexts/HabitContext';

export default function LandingPage() {
  const { isLoading, error, user } = useHabit();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!user) {
    return <div>Please sign in to continue</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Chain tiny habits into powerful routines
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Build lasting habits,
                  <br />
                  two minutes at a time
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Habit Stacker helps you create sustainable behavior changes by focusing on micro-habits that connect
                  to your existing routines.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center pb-8">
          <Link href="#features" className="animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </Link>
        </div>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Habit Stacking Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Build powerful routines by connecting small habits to things you already do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-background">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold">Start Tiny</h3>
                <p className="text-muted-foreground text-center">
                  Begin with habits that take less than 2 minutes to complete. Small enough to be easy, significant
                  enough to matter.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-background">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold">Stack Strategically</h3>
                <p className="text-muted-foreground text-center">
                  Connect new habits to existing behaviors. "After I brush my teeth, I will do 5 pushups."
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-background">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold">Build Chains</h3>
                <p className="text-muted-foreground text-center">
                  Create powerful routines by linking multiple small habits together into a seamless chain.
                </p>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/dashboard">
                <Button size="lg">Start Building Your Habits</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Example Habit Stacks</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Get inspired with these pre-built habit stacks you can adapt to your routine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="bg-primary/10 px-6 py-4 rounded-t-lg">
                  <h3 className="text-xl font-bold">Morning Energy Boost</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <p className="font-medium">Drink a glass of water</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After waking up • 1 min</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <p className="font-medium">Stretch for 2 minutes</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After drinking water • 2 min</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <p className="font-medium">Write down one goal for the day</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After stretching • 1 min</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="bg-primary/10 px-6 py-4 rounded-t-lg">
                  <h3 className="text-xl font-bold">Evening Wind Down</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <p className="font-medium">Put phone in another room</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After dinner • 1 min</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <p className="font-medium">Read one page of a book</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After putting phone away • 2 min</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <p className="font-medium">Practice deep breathing</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">After reading • 1 min</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/dashboard">
                <Button size="lg">Create Your Own Stack</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 HabitStacker. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

