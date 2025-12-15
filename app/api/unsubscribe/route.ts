import { unsubscribeStock } from "@/lib/stock-storage"

export async function POST(request: Request) {
  try {
    const { userId, symbol } = await request.json()

    if (!userId || !symbol) {
      return Response.json({ message: "User ID and symbol required" }, { status: 400 })
    }

    const success = unsubscribeStock(userId, symbol)

    if (!success) {
      return Response.json({ message: "Stock not found in subscriptions" }, { status: 404 })
    }

    return Response.json({ message: "Unsubscribed successfully" }, { status: 200 })
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
