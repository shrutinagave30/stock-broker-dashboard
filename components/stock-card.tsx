"use client"

import { TrendingUp, TrendingDown, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Stock {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

interface StockCardProps {
  stock: Stock
  onUnsubscribe: () => void
}

export default function StockCard({ stock, onUnsubscribe }: StockCardProps) {
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const { toast } = useToast()

  const isPositive = stock.change >= 0

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true)
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          symbol: stock.symbol,
        }),
      })
      if (response.ok) {
        toast({
          title: "Unsubscribed",
          description: `You stopped tracking ${stock.symbol}`,
        })
        onUnsubscribe()
      }
    } finally {
      setIsUnsubscribing(false)
    }
  }

  return (
    <Card className="p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg group relative">
      {/* Unsubscribe button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleUnsubscribe}
        disabled={isUnsubscribing}
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Stock Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">{stock.symbol}</h3>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? "bg-green-500/10" : "bg-red-500/10"}`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {stock.changePercent > 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-3xl font-bold mb-1">₹{stock.price.toFixed(2)}</p>
        <p className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)}
        </p>
      </div>

      {/* Sparkline */}
      <div className="h-12 bg-muted rounded-lg flex items-end justify-between p-2 mb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`w-1 ${isPositive ? "bg-green-500" : "bg-red-500"}`}
            style={{ height: `${Math.random() * 100}%`, opacity: 0.5 + Math.random() * 0.5 }}
          />
        ))}
      </div>

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground">Updated {new Date(stock.timestamp).toLocaleTimeString()}</p>
    </Card>
  )
}
