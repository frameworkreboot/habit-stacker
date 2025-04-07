import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { HabitProvider } from "@/lib/contexts/HabitContext"
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { SiteHeader } from '@/components/site-header'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Habit Stacker",
  description: "Chain tiny habits into powerful routines",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <HabitProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </HabitProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'