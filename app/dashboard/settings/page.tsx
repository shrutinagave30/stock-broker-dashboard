"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

interface User {
  id: string
  email: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }

    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
    router.push("/login")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!user) return null

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar user={user} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} onLogout={handleLogout} />

          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences</p>
              </div>

              <div className="max-w-2xl">
                <Card className="p-6 border border-border">
                  <h3 className="font-bold mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">User ID</label>
                      <p className="font-medium">{user.id}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border mt-6">
                  <h3 className="font-bold mb-4">Preferences</h3>
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <Button onClick={toggleDarkMode} variant="outline">
                      {isDarkMode ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
