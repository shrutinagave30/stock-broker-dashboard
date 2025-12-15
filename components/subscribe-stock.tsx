"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"

const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]

interface SubscribeStockProps {
  userId: string
  onSubscribed: () => void
}

export default function SubscribeStock({ userId, onSubscribed }: SubscribeStockProps) {
  const [selectedStock, setSelectedStock] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { data: stocks } = useSWR(`/api/stocks?userId=${userId}`, (url) => fetch(url).then((r) => r.json()), {
    refreshInterval: 5000,
  })

  const subscribedStocks = stocks?.subscriptions?.map((s: any) => s.symbol) || []
  const availableStocks = SUPPORTED_STOCKS.filter((stock) => !subscribedStocks.includes(stock))

  const handleSubscribe = async () => {
    if (!selectedStock) {
      setError("Please select a stock")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedStock, userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Failed to subscribe")
        setIsLoading(false)
        return
      }

      setSelectedStock("")
      onSubscribed()
      setIsLoading(false)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribe to Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Stock Ticker</label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a stock..." />
            </SelectTrigger>
            <SelectContent>
              {availableStocks.length > 0 ? (
                availableStocks.map((stock) => (
                  <SelectItem key={stock} value={stock}>
                    {stock}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  All stocks subscribed
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleSubscribe}
          disabled={isLoading || !selectedStock || availableStocks.length === 0}
          className="w-full"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Available Stocks</p>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_STOCKS.map((stock) => (
              <div
                key={stock}
                className={`px-3 py-2 rounded text-xs font-medium text-center ${
                  subscribedStocks.includes(stock) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {stock}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
