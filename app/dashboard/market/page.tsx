"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, Plus, Check, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
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
}

interface MarketStock {
  symbol: string
  price: number
  change: number
  changePercent: number
  isSubscribed: boolean
  isInWatchlist: boolean
}

export default function MarketPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [marketStocks, setMarketStocks] = useState<MarketStock[]>([])
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set())
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(new Set())
  const [subscribingSymbol, setSubscribingSymbol] = useState<string | null>(null)
  const [watchlistingSymbol, setWatchlistingSymbol] = useState<string | null>(null)

  const allStocks = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]

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
    if (!user?.id) return

    const fetchMarketData = async () => {
      try {
        const subsResponse = await fetch(`/api/stocks?userId=${user.id}`)
        const subsData = await subsResponse.json()
        const userStocks = subsData.subscriptions || []
        const subscribed = new Set(userStocks.map((s: Stock) => s.symbol))
        setSubscribedSymbols(subscribed)

        const watchlistResponse = await fetch(`/api/watchlist?userId=${user.id}`)
        const watchlistData = await watchlistResponse.json()
        const watchlistStocks = watchlistData.watchlist || []
        const watched = new Set(watchlistStocks.map((s: Stock) => s.symbol))
        setWatchlistSymbols(watched)

        const marketResponse = await fetch(`/api/market`)
        const marketData = await marketResponse.json()

        const combinedData = allStocks.map((symbol) => {
          const marketStock = marketData.stocks?.find((s: Stock) => s.symbol === symbol)
          return {
            symbol,
            price: marketStock?.price || 0,
            change: marketStock?.change || 0,
            changePercent: marketStock?.changePercent || 0,
            isSubscribed: subscribed.has(symbol),
            isInWatchlist: watched.has(symbol),
          }
        })

        setMarketStocks(combinedData)
      } catch (error) {
        console.error("Error fetching market data:", error)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 1000)

    return () => clearInterval(interval)
  }, [user?.id])

  const handleSubscribe = async (symbol: string) => {
    if (!user?.id) return

    setSubscribingSymbol(symbol)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, symbol }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Subscription Failed",
          description: data.message || "Unable to subscribe to this stock",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Subscribed Successfully",
        description: `You are now tracking ${symbol}`,
      })

      setSubscribedSymbols((prev) => new Set([...prev, symbol]))
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while subscribing",
        variant: "destructive",
      })
    } finally {
      setSubscribingSymbol(null)
    }
  }

  const handleToggleWatchlist = async (symbol: string, isInWatchlist: boolean) => {
    if (!user?.id) return

    setWatchlistingSymbol(symbol)

    try {
      const method = isInWatchlist ? "DELETE" : "POST"
      const response = await fetch("/api/watchlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, symbol }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Watchlist Update Failed",
          description: data.message || "Unable to update watchlist",
          variant: "destructive",
        })
        return
      }

      toast({
        title: isInWatchlist ? "Removed from Watchlist" : "Added to Watchlist",
        description: isInWatchlist ? `${symbol} removed from your watchlist` : `${symbol} added to your watchlist`,
      })

      if (isInWatchlist) {
        setWatchlistSymbols((prev) => {
          const newSet = new Set(prev)
          newSet.delete(symbol)
          return newSet
        })
      } else {
        setWatchlistSymbols((prev) => new Set([...prev, symbol]))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating watchlist",
        variant: "destructive",
      })
    } finally {
      setWatchlistingSymbol(null)
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Market</h2>
                <p className="text-muted-foreground">Browse all available stocks with live prices</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketStocks.map((stock) => (
                  <Card
                    key={stock.symbol}
                    className="p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{stock.symbol}</h3>
                        <p className="text-3xl font-bold">₹{stock.price.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{stock.symbol.charAt(0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {stock.changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleSubscribe(stock.symbol)}
                        disabled={stock.isSubscribed || subscribingSymbol === stock.symbol}
                        className={`${stock.isSubscribed ? "bg-green-500/20 text-green-500 hover:bg-green-500/20" : "bg-primary hover:bg-primary/90"}`}
                      >
                        {stock.isSubscribed ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Owned
                          </>
                        ) : subscribingSymbol === stock.symbol ? (
                          "..."
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            Buy
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleToggleWatchlist(stock.symbol, stock.isInWatchlist)}
                        disabled={watchlistingSymbol === stock.symbol}
                        variant={stock.isInWatchlist ? "secondary" : "outline"}
                      >
                        {watchlistingSymbol === stock.symbol ? (
                          "..."
                        ) : stock.isInWatchlist ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Watching
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Watch
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
