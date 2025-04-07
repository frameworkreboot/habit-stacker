"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, PlusCircle, Home, Layers } from "lucide-react"
import { UserProfile } from '@/components/user-profile'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '../components/mode-toggle'

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Stack", href: "/dashboard", icon: Layers },
  { name: "Add", href: "/habits/new", icon: PlusCircle },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-start space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">HabitStacker</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-1 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link 
              href="/settings" 
              className={cn(
                "hover:opacity-75",
                pathname === "/settings" ? "text-primary" : ""
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </nav>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserProfile />
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

