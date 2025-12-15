import { getUser } from "@/lib/user-storage"

// In-memory user database (persisted via localStorage in client)
const users: { [key: string]: { id: string; email: string; password: string } } = {
  "user1@example.com": {
    id: "1",
    email: "user1@example.com",
    password: "password123",
  },
  "user2@example.com": {
    id: "2",
    email: "user2@example.com",
    password: "password123",
  },
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password required" }, { status: 400 })
    }

    const user = getUser(email) || users[email]

    if (!user || user.password !== password) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 })
    }

    return Response.json(
      {
        user: { id: user.id, email: user.email },
        token: `token_${user.id}_${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
