"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AcademicBranch } from "@/app/page"
import { Monitor, Zap, Cog, Building, FlaskConical, Lightbulb, Plane, Heart } from "lucide-react"

interface BranchSelectionProps {
  onBranchSelect: (branch: AcademicBranch) => void
}

const branches = [
  {
    name: "Computer Science" as AcademicBranch,
    icon: Monitor,
    description: "Software development, algorithms, data structures, and system design",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    topics: ["Programming", "Data Structures", "System Design", "Databases"],
  },
  {
    name: "Electronics Engineering" as AcademicBranch,
    icon: Zap,
    description: "Circuit design, embedded systems, and electronic device development",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    topics: ["Circuit Design", "Microprocessors", "Signal Processing", "PCB Design"],
  },
  {
    name: "Mechanical Engineering" as AcademicBranch,
    icon: Cog,
    description: "Machine design, thermodynamics, and manufacturing processes",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    topics: ["Thermodynamics", "Machine Design", "Manufacturing", "CAD/CAM"],
  },
  {
    name: "Civil Engineering" as AcademicBranch,
    icon: Building,
    description: "Infrastructure design, construction management, and structural analysis",
    color: "bg-green-50 text-green-700 border-green-200",
    topics: ["Structural Analysis", "Construction", "Surveying", "Project Management"],
  },
  {
    name: "Chemical Engineering" as AcademicBranch,
    icon: FlaskConical,
    description: "Process design, chemical reactions, and industrial applications",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    topics: ["Process Design", "Chemical Reactions", "Mass Transfer", "Plant Design"],
  },
  {
    name: "Electrical Engineering" as AcademicBranch,
    icon: Lightbulb,
    description: "Power systems, control systems, and electrical device design",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    topics: ["Power Systems", "Control Systems", "Motors", "Power Electronics"],
  },
  {
    name: "Aerospace Engineering" as AcademicBranch,
    icon: Plane,
    description: "Aircraft design, propulsion systems, and aerospace technology",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    topics: ["Aerodynamics", "Propulsion", "Flight Mechanics", "Materials"],
  },
  {
    name: "Biomedical Engineering" as AcademicBranch,
    icon: Heart,
    description: "Medical device design, biomechanics, and healthcare technology",
    color: "bg-red-50 text-red-700 border-red-200",
    topics: ["Medical Devices", "Biomechanics", "Imaging", "Rehabilitation"],
  },
]

export function BranchSelection({ onBranchSelect }: BranchSelectionProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">AI Interview Simulator</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Practice your interview skills with AI-powered questions tailored to your academic branch. Build confidence
            and improve your responses in a supportive environment.
          </p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Choose Your Academic Branch</h2>
          <p className="text-muted-foreground">Select your field of study to get personalized interview questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {branches.map((branch) => {
            const IconComponent = branch.icon
            return (
              <Card
                key={branch.name}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
                onClick={() => onBranchSelect(branch.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${branch.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{branch.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{branch.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {branch.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                    variant="outline"
                  >
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card border rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  1
                </div>
                <p className="text-muted-foreground text-center">
                  Select your academic branch and start the interview simulation
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  2
                </div>
                <p className="text-muted-foreground text-center">
                  Answer questions one by one, starting simple and getting more challenging
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  3
                </div>
                <p className="text-muted-foreground text-center">
                  Receive detailed feedback with strengths, improvements, and tips
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
