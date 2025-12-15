"use client"

import { useState } from "react"
import { X, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]

interface SubscribeStockModalProps {
  isOpen: boolean
  userId: string
  onClose: () => void
  onSubscribed: () => void
}

export default function SubscribeStockModal({ isOpen, userId, onClose, onSubscribed }: SubscribeStockModalProps) {
  const [selectedStock, setSelectedStock] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubscribe = async () => {
    if (!selectedStock) {
      setError("Please select a stock")
      return
    }

    setIsSubscribing(true)
    setError("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          symbol: selectedStock,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to subscribe")
        return
      }

      toast({
        title: "Subscribed Successfully",
        description: `You are now tracking ${selectedStock}`,
      })

      setSelectedStock("")
      onSubscribed()
    } catch (err) {
      setError("An error occurred")
    } finally {
      setIsSubscribing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Subscribe to Stock</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubscribing}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Stock Ticker</label>
          <select
            value={selectedStock}
            onChange={(e) => {
              setSelectedStock(e.target.value)
              setError("")
            }}
            disabled={isSubscribing}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose a stock...</option>
            {SUPPORTED_STOCKS.map((stock) => (
              <option key={stock} value={stock}>
                {stock}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Grid */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Available Stocks</p>
          <div className="grid grid-cols-3 gap-2">
            {SUPPORTED_STOCKS.map((stock) => (
              <button
                key={stock}
                onClick={() => {
                  setSelectedStock(stock)
                  setError("")
                }}
                className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                  selectedStock === stock
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {stock}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">{error}</div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubscribing} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={isSubscribing || !selectedStock}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isSubscribing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
