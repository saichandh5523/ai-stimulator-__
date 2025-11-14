"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Type, Send, RotateCcw } from "lucide-react"

interface ResponseInputProps {
  onSubmit: (response: string) => void
}

type ResponseMode = "text" | "audio" | "video"

export function ResponseInput({ onSubmit }: ResponseInputProps) {
  const [response, setResponse] = useState("")
  const [responseMode, setResponseMode] = useState<ResponseMode>("text")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecorded, setHasRecorded] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleTextSubmit = () => {
    if (response.trim()) {
      onSubmit(response.trim())
      setResponse("")
    }
  }

  const startRecording = async (mode: "audio" | "video") => {
    try {
      const constraints = mode === "video" ? { video: true, audio: true } : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mode === "video" ? "video/webm" : "audio/webm" })
        // In a real implementation, you would process the audio/video here
        // For now, we'll just acknowledge the recording
        setHasRecorded(true)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      alert("Unable to access microphone/camera. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const handleRecordingSubmit = () => {
    if (hasRecorded) {
      // In a real implementation, you would transcribe the audio/video
      // For now, we'll submit a placeholder response
      onSubmit(
        `[${responseMode.toUpperCase()} RESPONSE] - Response recorded successfully. Duration: ${recordingTime} seconds.`,
      )
      resetRecording()
    }
  }

  const resetRecording = () => {
    setHasRecorded(false)
    setRecordingTime(0)
    setIsRecording(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Response</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={responseMode === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setResponseMode("text")}
            >
              <Type className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              variant={responseMode === "audio" ? "default" : "outline"}
              size="sm"
              onClick={() => setResponseMode("audio")}
            >
              <Mic className="h-4 w-4 mr-1" />
              Audio
            </Button>
            <Button
              variant={responseMode === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setResponseMode("video")}
            >
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {responseMode === "text" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your response here... Be specific and provide examples where possible."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleTextSubmit()
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {response.length} characters • Press Ctrl+Enter to submit
              </div>
              <Button onClick={handleTextSubmit} disabled={!response.trim()} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Response
              </Button>
            </div>
          </div>
        )}

        {(responseMode === "audio" || responseMode === "video") && (
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
              {!isRecording && !hasRecorded && (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {responseMode === "audio" ? (
                      <Mic className="h-8 w-8 text-primary" />
                    ) : (
                      <Video className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Ready to record your {responseMode} response</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the button below to start recording. Speak clearly and take your time.
                    </p>
                    <Button onClick={() => startRecording(responseMode)}>
                      {responseMode === "audio" ? (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Audio Recording
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Recording
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                    {responseMode === "audio" ? (
                      <Mic className="h-8 w-8 text-red-600" />
                    ) : (
                      <Video className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  <div>
                    <Badge variant="destructive" className="mb-2">
                      Recording • {formatTime(recordingTime)}
                    </Badge>
                    <h3 className="font-medium text-foreground mb-2">Recording in progress...</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Speak naturally and answer the question thoroughly.
                    </p>
                    <Button variant="destructive" onClick={stopRecording}>
                      {responseMode === "audio" ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <VideoOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {hasRecorded && !isRecording && (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    {responseMode === "audio" ? (
                      <Mic className="h-8 w-8 text-green-600" />
                    ) : (
                      <Video className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Recorded • {formatTime(recordingTime)}
                    </Badge>
                    <h3 className="font-medium text-foreground mb-2">
                      {responseMode === "audio" ? "Audio" : "Video"} recorded successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your response has been captured. You can re-record or submit this response.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={resetRecording}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Re-record
                      </Button>
                      <Button onClick={handleRecordingSubmit}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Response
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Note: In this demo, {responseMode} responses are acknowledged but not processed. In a real implementation,
              responses would be transcribed and analyzed.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
