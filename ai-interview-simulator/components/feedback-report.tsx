"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { FeedbackData, AcademicBranch, InterviewResponse } from "@/app/page"
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Download,
  Share2,
  TrendingUp,
  Clock,
  MessageSquare,
} from "lucide-react"

interface FeedbackReportProps {
  feedbackData: FeedbackData
  branch: AcademicBranch
  responses: InterviewResponse[]
  onStartOver: () => void
}

export function FeedbackReport({ feedbackData, branch, responses, onStartOver }: FeedbackReportProps) {
  const { strengths, weaknesses, suggestions, overallImpression, score } = feedbackData

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const totalTime =
    responses.length > 0
      ? Math.round((responses[responses.length - 1].timestamp.getTime() - responses[0].timestamp.getTime()) / 60000)
      : 0

  const avgResponseLength = responses.reduce((sum, r) => sum + r.answer.length, 0) / responses.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground">Here's your detailed performance analysis</p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
            <CardTitle className="text-2xl">{getScoreLabel(score)} Performance</CardTitle>
            <p className="text-muted-foreground">{branch} Interview Simulation</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm text-muted-foreground">{score}/100</span>
                </div>
                <Progress value={score} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Questions</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{responses.length}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalTime} min</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Avg Length</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{Math.round(avgResponseLength)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-xl">Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-xl">Areas for Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{weakness}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Impression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Overall Impression</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{overallImpression}</p>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Actionable Suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-blue-900">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Response Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <span className="text-xs text-muted-foreground">{response.answer.length} characters</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2 leading-relaxed">{response.question}</p>
                  <Separator className="my-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {response.answer.length > 200 ? `${response.answer.substring(0, 200)}...` : response.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onStartOver} variant="outline" className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Try Another Branch
          </Button>
          <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Save Report
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My Interview Performance",
                  text: `I scored ${score}/100 on my ${branch} interview simulation!`,
                  url: window.location.href,
                })
              }
            }}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}
