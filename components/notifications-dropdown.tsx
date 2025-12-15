"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  symbol: string
  type: "price_up" | "price_down" | "alert"
  message: string
  timestamp: number
}

interface NotificationsDropdownProps {
  stocks: Array<{ symbol: string; price: number; change: number }>
}

export default function NotificationsDropdown({ stocks }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Track price changes and generate notifications
  useEffect(() => {
    if (!stocks) return

    const newNotifications: Notification[] = []

    stocks.forEach((stock) => {
      const prevPrice = previousPrices[stock.symbol]

      if (prevPrice !== undefined) {
        if (stock.price > prevPrice && stock.change > 0) {
          newNotifications.push({
            id: `${stock.symbol}-up-${Date.now()}`,
            symbol: stock.symbol,
            type: "price_up",
            message: `${stock.symbol} is up ${stock.change > 0 ? "+" : ""}${stock.change.toFixed(2)}`,
            timestamp: Date.now(),
          })
        } else if (stock.price < prevPrice && stock.change < 0) {
          newNotifications.push({
            id: `${stock.symbol}-down-${Date.now()}`,
            symbol: stock.symbol,
            type: "price_down",
            message: `${stock.symbol} is down ${stock.change.toFixed(2)}`,
            timestamp: Date.now(),
          })
        }
      }
    })

    // Add new notifications to the top and keep only last 10
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 10))
    }

    // Update previous prices
    const newPrices: Record<string, number> = {}
    stocks.forEach((stock) => {
      newPrices[stock.symbol] = stock.price
    })
    setPreviousPrices(newPrices)
  }, [stocks])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const unreadCount = notifications.length

  return (
    <div ref={dropdownRef} className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} title="Notifications" className="relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="border-b border-border p-4 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifications([])}
              className="h-6 w-6"
              title="Clear all"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted transition-colors cursor-pointer flex items-start gap-3`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notification.type === "price_up" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
