"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { AcademicBranch, InterviewResponse, FeedbackData } from "@/app/page"
import { ArrowLeft, Clock, MessageSquare } from "lucide-react"
import { ResponseInput } from "@/components/response-input"
import { getQuestionsForBranch, generateFeedback } from "@/lib/interview-data"

interface InterviewSimulatorProps {
  branch: AcademicBranch
  onComplete: (responses: InterviewResponse[], feedback: FeedbackData) => void
  onBack: () => void
}

export function InterviewSimulator({ branch, onComplete, onBack }: InterviewSimulatorProps) {
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<Date>(new Date())

  useEffect(() => {
    // Initialize questions for the selected branch
    const branchQuestions = getQuestionsForBranch(branch)
    setQuestions(branchQuestions)
    setIsLoading(false)
    setStartTime(new Date())
  }, [branch])

  const handleResponseSubmit = (answer: string) => {
    const newResponse: InterviewResponse = {
      question: questions[currentQuestionIndex],
      answer,
      timestamp: new Date(),
    }

    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Interview complete, generate feedback
      const feedback = generateFeedback(updatedResponses, branch)
      onComplete(updatedResponses, feedback)
    }
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentQuestion = questions[currentQuestionIndex]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Preparing your interview questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Branches
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Interview Simulation</h1>
              <p className="text-muted-foreground">{branch}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Interview Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question Panel */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Interview Question</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
                    <p className="text-lg leading-relaxed text-foreground">{currentQuestion}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Response Input */}
              <ResponseInput onSubmit={handleResponseSubmit} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Be Specific</p>
                    <p className="text-muted-foreground">Use concrete examples and numbers when possible</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Structure Your Answer</p>
                    <p className="text-muted-foreground">Use frameworks like STAR (Situation, Task, Action, Result)</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Stay Relevant</p>
                    <p className="text-muted-foreground">Keep your answers focused on the question asked</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Show Enthusiasm</p>
                    <p className="text-muted-foreground">Demonstrate genuine interest in the role and company</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions Answered</span>
                      <span className="font-medium">{responses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">{questions.length - responses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Elapsed</span>
                      <span className="font-medium">
                        {Math.round((new Date().getTime() - startTime.getTime()) / 60000)} min
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Questions */}
              {responses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Previous Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {responses.map((response, index) => (
                        <div key={index} className="text-sm p-2 bg-muted/30 rounded">
                          <p className="font-medium text-foreground mb-1">Q{index + 1}:</p>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {response.question.length > 80
                              ? `${response.question.substring(0, 80)}...`
                              : response.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
