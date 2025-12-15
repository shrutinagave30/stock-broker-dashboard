import { createUser } from "@/lib/user-storage"

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

const nextUserId = 3

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password required" }, { status: 400 })
    }

    const newUser = createUser(email, password)

    if (!newUser) {
      return Response.json({ message: "User already exists" }, { status: 400 })
    }

    return Response.json(
      {
        user: { id: newUser.id, email: newUser.email },
        token: `token_${newUser.id}_${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
