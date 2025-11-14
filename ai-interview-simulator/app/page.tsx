"use client"

import { useState, useEffect } from "react"
import { BranchSelection } from "@/components/branch-selection"
import { InterviewSimulator } from "@/components/interview-simulator"
import { FeedbackReport } from "@/components/feedback-report"
import { SignIn } from "@/components/auth/sign-in"
import { SignUp } from "@/components/auth/sign-up"
import { Dashboard } from "@/components/dashboard"
import { authService, type User } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export type AcademicBranch =
  | "Computer Science"
  | "Electronics Engineering"
  | "Mechanical Engineering"
  | "Civil Engineering"
  | "Chemical Engineering"
  | "Electrical Engineering"
  | "Aerospace Engineering"
  | "Biomedical Engineering"

export type InterviewResponse = {
  question: string
  answer: string
  timestamp: Date
}

export type FeedbackData = {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  overallImpression: string
  score: number
}

type AppState = "auth" | "dashboard" | "branch-selection" | "interview" | "feedback"
type AuthMode = "signin" | "signup"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("auth")
  const [authMode, setAuthMode] = useState<AuthMode>("signin")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<AcademicBranch | null>(null)
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>([])
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [authMessage, setAuthMessage] = useState<string>("")
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setAppState("dashboard")
    }
  }, [])

  const handleAuthSuccess = (message: string) => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setAppState("dashboard")
      setAuthMessage(message)
      setShowAuthMessage(true)
      setTimeout(() => setShowAuthMessage(false), 5000)
    }
  }

  const handleSignUpSuccess = (message: string) => {
    setAuthMessage(message)
    setShowAuthMessage(true)
    setAuthMode("signin")
    setTimeout(() => setShowAuthMessage(false), 8000)
  }

  const handleSignOut = () => {
    const logoutMessage = authService.signOut()
    setCurrentUser(null)
    setAppState("auth")
    setAuthMode("signin")
    setAuthMessage(logoutMessage)
    setShowAuthMessage(true)
    setSelectedBranch(null)
    setInterviewResponses([])
    setFeedbackData(null)
    setTimeout(() => setShowAuthMessage(false), 3000)
  }

  const handleStartInterview = () => {
    if (!authService.isAuthenticated()) {
      setAuthMessage("Please login first to continue.")
      setShowAuthMessage(true)
      setAppState("auth")
      setTimeout(() => setShowAuthMessage(false), 5000)
      return
    }
    setAppState("branch-selection")
  }

  const handleBranchSelect = (branch: AcademicBranch) => {
    setSelectedBranch(branch)
    setInterviewResponses([])
    setFeedbackData(null)
    setAppState("interview")
  }

  const handleInterviewComplete = (responses: InterviewResponse[], feedback: FeedbackData) => {
    setInterviewResponses(responses)
    setFeedbackData(feedback)
    setAppState("feedback")

    if (currentUser && selectedBranch) {
      const session = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        branch: selectedBranch,
        responses: responses.map((r) => ({
          question: r.question,
          answer: r.answer,
          timestamp: r.timestamp,
          responseTime: 0,
        })),
        startTime: responses[0]?.timestamp || new Date(),
        endTime: new Date(),
        score: feedback.score,
        feedback,
        status: "completed" as const,
      }
      authService.saveInterviewSession(session)
    }
  }

  const handleBackToDashboard = () => {
    setSelectedBranch(null)
    setInterviewResponses([])
    setFeedbackData(null)
    setAppState("dashboard")
  }

  if (appState === "auth") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showAuthMessage && (
            <Alert className="mb-4">
              <AlertDescription>{authMessage}</AlertDescription>
            </Alert>
          )}
          {authMode === "signin" ? (
            <SignIn onSuccess={handleAuthSuccess} onSwitchToSignUp={() => setAuthMode("signup")} />
          ) : (
            <SignUp onSuccess={handleSignUpSuccess} onSwitchToSignIn={() => setAuthMode("signin")} />
          )}
        </div>
      </div>
    )
  }

  if (appState === "dashboard" && currentUser) {
    return (
      <div>
        {showAuthMessage && (
          <div className="fixed top-4 right-4 z-50">
            <Alert className="max-w-md">
              <AlertDescription>{authMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        <Dashboard user={currentUser} onStartInterview={handleStartInterview} onSignOut={handleSignOut} />
      </div>
    )
  }

  if (appState === "branch-selection") {
    return <BranchSelection onBranchSelect={handleBranchSelect} />
  }

  if (appState === "interview" && selectedBranch) {
    return (
      <InterviewSimulator
        branch={selectedBranch}
        onComplete={handleInterviewComplete}
        onBack={() => setAppState("branch-selection")}
      />
    )
  }

  if (appState === "feedback" && feedbackData && selectedBranch) {
    return (
      <FeedbackReport
        feedbackData={feedbackData}
        branch={selectedBranch}
        responses={interviewResponses}
        onStartOver={handleBackToDashboard}
      />
    )
  }

  return null
}
