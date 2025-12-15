"use client"

import { Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotificationsDropdown from "@/components/notifications-dropdown"

interface User {
  id: string
  email: string
}

interface HeaderProps {
  user: User
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  stocks?: Array<{ symbol: string; price: number; change: number }>
}

export default function Header({ user, isDarkMode, onToggleDarkMode, onLogout, stocks = [] }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Stock Broker</h1>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <NotificationsDropdown stocks={stocks} />

          <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-border">
            <div className="text-right text-sm">
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
