"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        setIsLoading(false)
        return
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user))
      localStorage.setItem("authToken", data.token)

      // Added success toast notification
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.email}!`,
      })

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Stock Broker</h1>
          </div>
          <p className="text-muted-foreground">Real-time stock trading dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border border-border shadow-lg">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-lg flex items-start gap-3">
                <span className="text-lg leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-muted border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-muted border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <button onClick={() => router.push("/signup")} className="text-primary hover:underline font-semibold">
              Create one
            </button>
          </p>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 p-5 border border-border/50 bg-muted/50 backdrop-blur">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span>🔓</span> Demo Credentials
          </h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-background rounded-lg border border-border/30">
              <p className="text-muted-foreground text-xs mb-1">User 1</p>
              <p className="font-mono text-foreground">user1@example.com</p>
              <p className="font-mono text-foreground">password123</p>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border/30">
              <p className="text-muted-foreground text-xs mb-1">User 2</p>
              <p className="font-mono text-foreground">user2@example.com</p>
              <p className="font-mono text-foreground">password123</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          This is a demo application. Data is simulated and not real.
        </p>
      </div>
    </div>
  )
}
