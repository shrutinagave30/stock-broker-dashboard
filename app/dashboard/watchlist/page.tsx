"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon, Trash2Icon, PlusIcon } from "lucide-react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
}

interface WatchlistStock {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export default function WatchlistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (!user) return

    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`/api/watchlist?userId=${user.id}`)
        const data = await response.json()
        setWatchlist(data.watchlist || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch watchlist:", error)
        setIsLoading(false)
      }
    }

    fetchWatchlist()
    const interval = setInterval(fetchWatchlist, 1000)
    return () => clearInterval(interval)
  }, [user])

  const handleRemoveFromWatchlist = async (symbol: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, symbol }),
      })

      if (response.ok) {
        toast({
          title: "Removed from watchlist",
          description: `${symbol} has been removed from your watchlist`,
        })
        setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  }

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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Watchlist</h2>
                  <p className="text-muted-foreground">Track stocks you're interested in</p>
                </div>
                <Button onClick={() => router.push("/dashboard/market")} className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Stocks
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading watchlist...</p>
                </div>
              ) : watchlist.length === 0 ? (
                <Card className="p-12 border border-dashed border-border text-center">
                  <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add stocks from the Market page to track their prices
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push("/dashboard/market")} variant="default">
                      Browse Market
                    </Button>
                    <Button onClick={() => router.push("/dashboard")} variant="outline">
                      Go to Portfolio
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {watchlist.map((stock) => (
                    <Card key={stock.symbol} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-muted-foreground">Watching</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-3xl font-bold">₹{stock.price.toFixed(2)}</div>
                        <div
                          className={`flex items-center gap-1 text-sm font-medium ${
                            stock.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <ArrowUpIcon className="h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4" />
                          )}
                          <span>
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
