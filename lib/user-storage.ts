// Shared in-memory user database
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

let nextUserId = 3

export function getUser(email: string) {
  return users[email]
}

export function createUser(email: string, password: string) {
  if (users[email]) {
    return null // User already exists
  }

  const newUser = {
    id: String(nextUserId++),
    email,
    password,
  }

  users[email] = newUser
  return newUser
}

export function getAllUsers() {
  return users
}
