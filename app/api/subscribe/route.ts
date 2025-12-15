import { addStock, SUPPORTED_STOCKS } from "@/lib/stock-storage"

export async function POST(request: Request) {
  try {
    const { symbol, userId } = await request.json()

    console.log("[v0] Subscribe API - Received request:", { symbol, userId })

    if (!symbol || !SUPPORTED_STOCKS.includes(symbol)) {
      console.log("[v0] Subscribe API - Invalid stock symbol:", symbol)
      return Response.json({ message: "Invalid stock symbol" }, { status: 400 })
    }

    if (!userId) {
      console.log("[v0] Subscribe API - No userId provided")
      return Response.json({ message: "User ID required" }, { status: 400 })
    }

    const added = addStock(userId, symbol)
    console.log("[v0] Subscribe API - addStock result:", { userId, symbol, added })

    if (!added) {
      console.log("[v0] Subscribe API - Already subscribed:", { userId, symbol })
      return Response.json({ message: "Already subscribed to this stock" }, { status: 400 })
    }

    console.log("[v0] Subscribe API - Successfully subscribed:", { userId, symbol })
    return Response.json({ message: "Subscribed successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Subscribe API - Error:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
