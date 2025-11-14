"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService, type User, type InterviewSession } from "@/lib/auth"
import { LogOut, Plus, Clock, TrendingUp, Calendar, Award, BarChart3 } from "lucide-react"

interface DashboardProps {
  user: User
  onStartInterview: () => void
  onSignOut: () => void
}

export function Dashboard({ user, onStartInterview, onSignOut }: DashboardProps) {
  const [sessions, setSessions] = useState<InterviewSession[]>([])

  useEffect(() => {
    const userSessions = authService.getUserSessions(user.id)
    setSessions(userSessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()))
  }, [user.id])

  const completedSessions = sessions.filter((s) => s.status === "completed")
  const averageScore =
    completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length)
      : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Ready to practice your interview skills?</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground">{completedSessions.length} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}</div>
              <p className="text-xs text-muted-foreground">Out of 100 points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                ago
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length > 0 ? "Recent" : "None"}</div>
              <p className="text-xs text-muted-foreground">
                {sessions.length > 0 ? formatDate(sessions[0].startTime).split(",")[0] : "Start your first interview"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new interview or continue your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onStartInterview} size="lg" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Start New Interview
            </Button>
          </CardContent>
        </Card>

        {/* Interview History */}
        <Card>
          <CardHeader>
            <CardTitle>Interview History</CardTitle>
            <CardDescription>
              {sessions.length > 0
                ? `You've completed ${completedSessions.length} interviews across different branches`
                : "No interviews yet - start your first one above!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No interviews yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your first interview to see your progress and get personalized feedback
                </p>
                <Button onClick={onStartInterview}>
                  <Plus className="h-4 w-4 mr-2" />
                  Start First Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{session.branch}</Badge>
                        <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                          {session.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                        {session.status === "completed" && session.score && (
                          <Badge className={getScoreColor(session.score)}>Score: {session.score}/100</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(session.startTime)}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.responses.length} questions answered
                      </span>
                      {session.endTime && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {Math.round(
                            (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000,
                          )}{" "}
                          min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
