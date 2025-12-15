"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Stock {
  symbol: string
  price: number
  lastPrice?: number
}

interface StockListProps {
  stocks: { subscriptions: Stock[] } | undefined
  isLoading: boolean
}

export default function StockList({ stocks, isLoading }: StockListProps) {
  if (isLoading && !stocks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </CardContent>
      </Card>
    )
  }

  const subscriptions = stocks?.subscriptions || []

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No subscriptions yet. Subscribe to a stock to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.map((stock: Stock) => {
            const change = stock.lastPrice ? stock.price - stock.lastPrice : 0
            const changePercent = stock.lastPrice ? ((change / stock.lastPrice) * 100).toFixed(2) : "0.00"
            const isPositive = change >= 0

            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground text-lg">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">Stock Price</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">₹{stock.price.toFixed(2)}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>
                      {isPositive ? "+" : ""}
                      {changePercent}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
