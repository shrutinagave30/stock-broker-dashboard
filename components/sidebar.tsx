"use client"

import { BarChart3, Home, Wallet, Settings } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  email: string
}

export default function Sidebar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Portfolio", href: "/dashboard" },
    { icon: BarChart3, label: "Market", href: "/dashboard/market" },
    { icon: Wallet, label: "Watchlist", href: "/dashboard/watchlist" },
  ]

  return (
    <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            SB
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground">Stock Broker</p>
            <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              onClick={() => router.push(item.href)}
              variant="ghost"
              className={`w-full justify-start gap-3 transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={() => router.push("/dashboard/settings")}
          variant="ghost"
          className={`w-full justify-start gap-3 transition-colors ${
            pathname === "/dashboard/settings"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}
