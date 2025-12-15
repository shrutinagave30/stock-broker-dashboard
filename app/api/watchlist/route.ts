import { type NextRequest, NextResponse } from "next/server"
import { getWatchlist, addToWatchlist, removeFromWatchlist, getUpdatedPrices } from "@/lib/stock-storage"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const watchlistSymbols = getWatchlist(userId)
  const prices = getUpdatedPrices()

  const watchlistStocks = watchlistSymbols.map((symbol) => ({
    symbol,
    price: prices[symbol],
    change: (Math.random() - 0.5) * 5,
    changePercent: (Math.random() - 0.5) * 2,
  }))

  return NextResponse.json({ watchlist: watchlistStocks })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, symbol } = body

    if (!userId || !symbol) {
      return NextResponse.json({ error: "User ID and symbol required" }, { status: 400 })
    }

    const success = addToWatchlist(userId, symbol)

    if (!success) {
      return NextResponse.json({ error: "Already in watchlist" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Added to watchlist" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, symbol } = body

    if (!userId || !symbol) {
      return NextResponse.json({ error: "User ID and symbol required" }, { status: 400 })
    }

    const success = removeFromWatchlist(userId, symbol)

    if (!success) {
      return NextResponse.json({ error: "Not in watchlist" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Removed from watchlist" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
