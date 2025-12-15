"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import StockCard from "@/components/stock-card"
import SubscribeStockModal from "@/components/subscribe-stock-modal"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

interface User {
  id: string
  email: string
}

interface Stock {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
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

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  useEffect(() => {
    if (!user?.id) return

    const fetchStocks = async () => {
      try {
        const response = await fetch(`/api/stocks?userId=${user.id}`)
        const data = await response.json()
        setStocks(data.subscriptions || [])
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching stocks:", error)
      }
    }

    fetchStocks()
    const interval = setInterval(fetchStocks, 1000)

    return () => clearInterval(interval)
  }, [user?.id])

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

  const handleSubscribed = () => {
    setIsSubscribeOpen(false)
    // Trigger immediate refetch
    if (user?.id) {
      fetch(`/api/stocks?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => {
          setStocks(data.subscriptions || [])
        })
    }
  }

  if (!user) return null

  const totalPortfolioValue = stocks.reduce((sum: number, stock: Stock) => sum + stock.price, 0)
  const upCount = stocks.filter((s: Stock) => s.change > 0).length
  const downCount = stocks.filter((s: Stock) => s.change < 0).length

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar user={user} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={user}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            stocks={stocks}
          />

          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
                <p className="text-muted-foreground">Monitor your subscribed stocks in real-time</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                      <p className="text-2xl font-bold">₹{totalPortfolioValue.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Holdings</p>
                      <p className="text-2xl font-bold">{stocks.length}</p>
                    </div>
                    <Activity className="w-8 h-8 text-primary opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 border border-border hover:border-green-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Gainers</p>
                      <p className="text-2xl font-bold text-green-500">{upCount}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 border border-border hover:border-red-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Losers</p>
                      <p className="text-2xl font-bold text-red-500">{downCount}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
                  </div>
                </Card>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Your Subscriptions</h3>
                  <Button onClick={() => setIsSubscribeOpen(true)} className="bg-primary hover:bg-primary/90">
                    + Subscribe Stock
                  </Button>
                </div>

                {stocks.length === 0 ? (
                  <Card className="p-12 border border-dashed border-border text-center">
                    <p className="text-muted-foreground mb-4">No stocks subscribed yet</p>
                    <Button onClick={() => setIsSubscribeOpen(true)} variant="outline">
                      Add Your First Stock
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stocks.map((stock: Stock) => (
                      <StockCard
                        key={stock.symbol}
                        stock={stock}
                        onUnsubscribe={() => {
                          if (user?.id) {
                            fetch(`/api/stocks?userId=${user.id}`)
                              .then((r) => r.json())
                              .then((data) => {
                                setStocks(data.subscriptions || [])
                              })
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <SubscribeStockModal
        isOpen={isSubscribeOpen}
        userId={user.id}
        onClose={() => setIsSubscribeOpen(false)}
        onSubscribed={handleSubscribed}
      />
    </div>
  )
}
