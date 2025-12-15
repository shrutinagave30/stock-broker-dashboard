// Shared in-memory stock storage across all API routes
const userStocks: { [userId: string]: { symbol: string; price: number; lastPrice: number; priceHistory: number[] }[] } =
  {}

const stockPrices: { [symbol: string]: number } = {
  GOOG: Math.random() * 100 + 120,
  TSLA: Math.random() * 100 + 200,
  AMZN: Math.random() * 100 + 150,
  META: Math.random() * 100 + 300,
  NVDA: Math.random() * 100 + 550,
}

const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]

const userWatchlists: { [userId: string]: string[] } = {}

export function getUpdatedPrices() {
  Object.keys(stockPrices).forEach((symbol) => {
    const lastPrice = stockPrices[symbol]
    const change = (Math.random() - 0.5) * 10
    stockPrices[symbol] = Math.max(1, lastPrice + change)
  })
  return stockPrices
}

export function getUserStocks(userId: string) {
  const stocks = userStocks[userId] || []
  console.log("[v0] getUserStocks - userId:", userId, "stocks count:", stocks.length)
  return stocks
}

export function setUserStocks(userId: string, stocks: any[]) {
  userStocks[userId] = stocks
  console.log("[v0] setUserStocks - userId:", userId, "stocks count:", stocks.length)
}

export function addStock(userId: string, symbol: string) {
  console.log("[v0] addStock - Before adding:", {
    userId,
    symbol,
    hasUserStocks: !!userStocks[userId],
    currentCount: userStocks[userId]?.length || 0,
  })

  if (!userStocks[userId]) {
    userStocks[userId] = []
    console.log("[v0] addStock - Created new array for userId:", userId)
  }

  if (userStocks[userId].some((s) => s.symbol === symbol)) {
    console.log("[v0] addStock - Already subscribed:", { userId, symbol })
    return false
  }

  userStocks[userId].push({
    symbol,
    price: stockPrices[symbol],
    lastPrice: stockPrices[symbol],
    priceHistory: [stockPrices[symbol]],
  })

  console.log("[v0] addStock - After adding:", {
    userId,
    symbol,
    currentCount: userStocks[userId].length,
    allUserStocks: Object.keys(userStocks).map((uid) => ({
      userId: uid,
      count: userStocks[uid].length,
    })),
  })

  return true
}

export function unsubscribeStock(userId: string, symbol: string): boolean {
  if (!userStocks[userId]) {
    return false
  }
  const index = userStocks[userId].findIndex((s) => s.symbol === symbol)
  if (index === -1) {
    return false
  }
  userStocks[userId].splice(index, 1)
  console.log("[v0] unsubscribeStock - Removed:", { userId, symbol, remainingCount: userStocks[userId].length })
  return true
}

export function getStockPrices() {
  return stockPrices
}

export function getWatchlist(userId: string): string[] {
  return userWatchlists[userId] || []
}

export function addToWatchlist(userId: string, symbol: string): boolean {
  if (!userWatchlists[userId]) {
    userWatchlists[userId] = []
  }

  if (userWatchlists[userId].includes(symbol)) {
    return false // Already in watchlist
  }

  userWatchlists[userId].push(symbol)
  console.log("[v0] addToWatchlist - Added:", { userId, symbol, watchlistCount: userWatchlists[userId].length })
  return true
}

export function removeFromWatchlist(userId: string, symbol: string): boolean {
  if (!userWatchlists[userId]) {
    return false
  }

  const index = userWatchlists[userId].indexOf(symbol)
  if (index === -1) {
    return false
  }

  userWatchlists[userId].splice(index, 1)
  console.log("[v0] removeFromWatchlist - Removed:", { userId, symbol, remainingCount: userWatchlists[userId].length })
  return true
}

export { SUPPORTED_STOCKS }
