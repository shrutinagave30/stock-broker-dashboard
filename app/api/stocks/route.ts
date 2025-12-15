import { getUpdatedPrices, getUserStocks } from "@/lib/stock-storage"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    console.log("[v0] Stocks API - GET request for userId:", userId)

    if (!userId) {
      console.log("[v0] Stocks API - No userId provided")
      return Response.json({ message: "User ID required" }, { status: 400 })
    }

    const updatedPrices = getUpdatedPrices()
    const userStocksList = getUserStocks(userId)

    console.log("[v0] Stocks API - Retrieved user stocks:", {
      userId,
      stockCount: userStocksList.length,
      stocks: userStocksList.map((s) => s.symbol),
    })

    const subscriptions = userStocksList.map((stock) => {
      const currentPrice = updatedPrices[stock.symbol]
      const lastPrice = stock.lastPrice || currentPrice
      const change = currentPrice - lastPrice
      const changePercent = (change / lastPrice) * 100 || 0

      stock.lastPrice = currentPrice

      return {
        symbol: stock.symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        timestamp: Date.now(),
      }
    })

    console.log("[v0] Stocks API - Returning subscriptions:", {
      userId,
      count: subscriptions.length,
      data: subscriptions,
    })

    return Response.json({ subscriptions }, { status: 200 })
  } catch (error) {
    console.error("[v0] Stocks API - Error:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
