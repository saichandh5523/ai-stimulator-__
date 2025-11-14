export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  lastLogin: Date
}

export interface InterviewSession {
  id: string
  userId: string
  branch: string
  responses: Array<{
    question: string
    answer: string
    timestamp: Date
    responseTime: number // seconds taken to respond
  }>
  startTime: Date
  endTime?: Date
  score?: number
  feedback?: any
  status: "in-progress" | "completed"
}

class AuthService {
  private currentUser: User | null = null

  constructor() {
    this.loadCurrentUser()
  }

  private loadCurrentUser() {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        this.currentUser = JSON.parse(userData)
      }
    }
  }

  private saveCurrentUser(user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
      this.currentUser = user
    }
  }

  private clearCurrentUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
      this.currentUser = null
    }
  }

  async signUp(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      // Check if user already exists
      const existingUsers = this.getAllUsers()
      if (existingUsers.find((u) => u.email === email)) {
        return { success: false, error: "User already exists with this email" }
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        createdAt: new Date(),
        lastLogin: new Date(),
      }

      // Save to localStorage but DON'T set as current user
      const users = [...existingUsers, newUser]
      localStorage.setItem("users", JSON.stringify(users))

      // Return success with welcome message
      return {
        success: true,
        message: `Welcome, ${name}! Your account has been created successfully. Please proceed to login to start your interview.`,
      }
    } catch (error) {
      return { success: false, error: "Failed to create account" }
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      const users = this.getAllUsers()
      const user = users.find((u) => u.email === email)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      // Update last login
      user.lastLogin = new Date()
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Set as current user
      this.saveCurrentUser(user)

      return {
        success: true,
        message: `Login successful. Welcome back, ${user.name}!`,
      }
    } catch (error) {
      return { success: false, error: "Failed to sign in" }
    }
  }

  signOut(): string {
    this.clearCurrentUser()
    return "Logout successful. You have been signed out."
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  private getAllUsers(): User[] {
    if (typeof window !== "undefined") {
      const usersData = localStorage.getItem("users")
      return usersData ? JSON.parse(usersData) : []
    }
    return []
  }

  // Session management
  saveInterviewSession(session: InterviewSession) {
    if (typeof window !== "undefined") {
      const sessions = this.getUserSessions(session.userId)
      const updatedSessions = sessions.filter((s) => s.id !== session.id)
      updatedSessions.push(session)
      localStorage.setItem(`sessions_${session.userId}`, JSON.stringify(updatedSessions))
    }
  }

  getUserSessions(userId: string): InterviewSession[] {
    if (typeof window !== "undefined") {
      const sessionsData = localStorage.getItem(`sessions_${userId}`)
      return sessionsData ? JSON.parse(sessionsData) : []
    }
    return []
  }

  getSessionById(sessionId: string, userId: string): InterviewSession | null {
    const sessions = this.getUserSessions(userId)
    return sessions.find((s) => s.id === sessionId) || null
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }
}

export const authService = new AuthService()
