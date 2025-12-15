import { getUpdatedPrices } from "@/lib/stock-storage"

export async function GET() {
  try {
    const allSymbols = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
    const updatedPrices = getUpdatedPrices()

    const stocks = allSymbols.map((symbol) => {
      const currentPrice = updatedPrices[symbol]
      const lastPrice = updatedPrices[`${symbol}_last`] || currentPrice
      const change = currentPrice - lastPrice
      const changePercent = (change / lastPrice) * 100 || 0

      updatedPrices[`${symbol}_last`] = currentPrice

      return {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        timestamp: Date.now(),
      }
    })

    return Response.json({ stocks }, { status: 200 })
  } catch (error) {
    console.error("Market API error:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
