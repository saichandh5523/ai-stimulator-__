import type { AcademicBranch, InterviewResponse, FeedbackData } from "@/app/page"

const questionBank = {
  "Computer Science": [
    "Tell me about yourself and why you're interested in computer science.",
    "Explain the difference between a stack and a queue data structure.",
    "How would you approach debugging a program that's running slowly?",
    "Describe a challenging programming project you've worked on.",
    "What is object-oriented programming and why is it useful?",
    "How would you design a system to handle 1 million users?",
    "Explain the concept of Big O notation with examples.",
  ],
  "Electronics Engineering": [
    "Tell me about yourself and your interest in electronics engineering.",
    "Explain the difference between analog and digital circuits.",
    "How would you troubleshoot a circuit that's not working as expected?",
    "Describe a project where you designed or built an electronic system.",
    "What is the purpose of a capacitor in a circuit?",
    "How would you approach designing a low-power embedded system?",
    "Explain the concept of impedance matching in RF circuits.",
  ],
  "Mechanical Engineering": [
    "Tell me about yourself and why you chose mechanical engineering.",
    "Explain the first and second laws of thermodynamics.",
    "How would you approach designing a mechanical system for high reliability?",
    "Describe a project where you applied engineering principles to solve a problem.",
    "What factors would you consider when selecting materials for a component?",
    "How would you optimize a manufacturing process for efficiency?",
    "Explain the concept of stress concentration and how to mitigate it.",
  ],
  "Civil Engineering": [
    "Tell me about yourself and your passion for civil engineering.",
    "Explain the difference between compression and tension in structural elements.",
    "How would you approach a site investigation for a new construction project?",
    "Describe a civil engineering project that interests you and why.",
    "What factors influence the design of a foundation system?",
    "How would you ensure quality control in a construction project?",
    "Explain the importance of sustainability in modern civil engineering.",
  ],
  "Chemical Engineering": [
    "Tell me about yourself and your interest in chemical engineering.",
    "Explain the concept of mass balance in chemical processes.",
    "How would you approach scaling up a laboratory process to industrial scale?",
    "Describe a chemical process that you find particularly interesting.",
    "What safety considerations are crucial in chemical plant design?",
    "How would you optimize a chemical reaction for maximum yield?",
    "Explain the role of heat transfer in chemical process design.",
  ],
  "Electrical Engineering": [
    "Tell me about yourself and why you chose electrical engineering.",
    "Explain the difference between AC and DC power systems.",
    "How would you approach designing a power distribution system?",
    "Describe a project involving electrical systems that you've worked on.",
    "What are the key considerations in motor selection for an application?",
    "How would you implement protection systems in electrical networks?",
    "Explain the concept of power factor and its importance.",
  ],
  "Aerospace Engineering": [
    "Tell me about yourself and your fascination with aerospace engineering.",
    "Explain the four forces acting on an aircraft in flight.",
    "How would you approach the design of a spacecraft thermal protection system?",
    "Describe an aerospace project or mission that inspires you.",
    "What are the key challenges in designing for the space environment?",
    "How would you optimize an aircraft design for fuel efficiency?",
    "Explain the concept of orbital mechanics and satellite trajectories.",
  ],
  "Biomedical Engineering": [
    "Tell me about yourself and your interest in biomedical engineering.",
    "Explain how you would approach designing a medical device for patient safety.",
    "How would you validate the biocompatibility of a new implant material?",
    "Describe a biomedical technology that you think has great potential.",
    "What regulatory considerations are important in medical device development?",
    "How would you approach solving a clinical problem through engineering?",
    "Explain the importance of human factors in medical device design.",
  ],
}

export function getQuestionsForBranch(branch: AcademicBranch): string[] {
  return questionBank[branch] || questionBank["Computer Science"]
}

export function generateFeedback(responses: InterviewResponse[], branch: AcademicBranch): FeedbackData {
  const totalResponses = responses.length
  const avgResponseLength = responses.reduce((sum, r) => sum + r.answer.length, 0) / totalResponses

  let score = 0
  const strengths: string[] = []
  const weaknesses: string[] = []
  const suggestions: string[] = []

  // Analyze each response for content quality
  const responseAnalysis = responses.map((response) => analyzeResponse(response, branch))

  // Calculate overall score based on individual response scores
  score = responseAnalysis.reduce((sum, analysis) => sum + analysis.score, 0) / totalResponses

  // Generate feedback based on analysis
  const overallAnalysis = {
    hasGoodTechnicalContent: responseAnalysis.some((r) => r.hasTechnicalTerms),
    hasStructuredAnswers: responseAnalysis.some((r) => r.isStructured),
    hasExamples: responseAnalysis.some((r) => r.hasExamples),
    hasIrrelevantAnswers: responseAnalysis.some((r) => r.isIrrelevant),
    hasBlankAnswers: responseAnalysis.some((r) => r.isBlank),
    avgLength: avgResponseLength,
  }

  // Generate strengths
  if (overallAnalysis.hasGoodTechnicalContent) {
    strengths.push("Demonstrates solid technical knowledge with appropriate terminology")
  }
  if (overallAnalysis.hasStructuredAnswers) {
    strengths.push("Provides well-organized and logical responses")
  }
  if (overallAnalysis.hasExamples) {
    strengths.push("Uses concrete examples to support explanations")
  }
  if (overallAnalysis.avgLength > 150) {
    strengths.push("Gives comprehensive and detailed answers")
  }

  // Generate weaknesses
  if (overallAnalysis.hasBlankAnswers) {
    weaknesses.push("Some responses were left blank or contained minimal content")
    suggestions.push("Ensure you provide substantive answers to all questions, even if you're unsure")
  }
  if (overallAnalysis.hasIrrelevantAnswers) {
    weaknesses.push("Some answers did not directly address the questions asked")
    suggestions.push("Read questions carefully and ensure your responses stay focused on what's being asked")
  }
  if (!overallAnalysis.hasGoodTechnicalContent) {
    weaknesses.push("Responses lack technical depth and domain-specific terminology")
    suggestions.push(`Review fundamental ${branch} concepts and practice using technical vocabulary`)
  }
  if (overallAnalysis.avgLength < 50) {
    weaknesses.push("Responses are too brief and lack sufficient detail")
    suggestions.push("Elaborate on your points with explanations, examples, and reasoning")
  }

  // Add general suggestions
  if (score < 70) {
    suggestions.push("Practice mock interviews to improve response quality and confidence")
    suggestions.push("Prepare specific examples from your coursework and projects beforehand")
  }

  // Ensure minimum feedback
  if (strengths.length === 0) {
    strengths.push("Shows willingness to participate in the interview process")
  }
  if (weaknesses.length === 0 && score < 90) {
    weaknesses.push("Minor improvements in response depth and technical detail would be beneficial")
  }

  return {
    strengths,
    weaknesses,
    suggestions,
    overallImpression: generateRealisticOverallImpression(score, branch, overallAnalysis),
    score: Math.round(score),
  }
}

function analyzeResponse(response: InterviewResponse, branch: AcademicBranch) {
  const answer = response.answer.trim().toLowerCase()
  const originalAnswer = response.answer.trim()

  // Check if response is blank or nonsensical
  const isBlank = answer.length < 10
  const isIrrelevant = checkIfIrrelevant(answer, response.question)

  if (isBlank) {
    return {
      score: 0,
      isBlank: true,
      isIrrelevant: false,
      hasTechnicalTerms: false,
      isStructured: false,
      hasExamples: false,
    }
  }

  if (isIrrelevant) {
    return {
      score: Math.random() * 20 + 10, // 10-30% for irrelevant answers
      isBlank: false,
      isIrrelevant: true,
      hasTechnicalTerms: false,
      isStructured: false,
      hasExamples: false,
    }
  }

  // Analyze content quality
  const technicalTerms = getTechnicalTermsForBranch(branch)
  const hasTechnicalTerms = technicalTerms.some((term) => answer.includes(term.toLowerCase()))

  const isStructured = checkIfStructured(originalAnswer)
  const hasExamples = checkIfHasExamples(answer)

  // Calculate score based on content quality
  let score = 40 // Base score for relevant answer

  if (hasTechnicalTerms) score += 25
  if (isStructured) score += 20
  if (hasExamples) score += 15
  if (originalAnswer.length > 100) score += 10
  if (originalAnswer.length > 200) score += 10

  return {
    score: Math.min(100, score),
    isBlank: false,
    isIrrelevant: false,
    hasTechnicalTerms,
    isStructured,
    hasExamples,
  }
}

function checkIfIrrelevant(answer: string, question: string): boolean {
  // Simple heuristic to check if answer is completely off-topic
  const questionKeywords = extractKeywords(question.toLowerCase())
  const answerWords = answer.split(" ").filter((word) => word.length > 3)

  // If answer has very few words in common with question, it might be irrelevant
  const commonWords = questionKeywords.filter((keyword) =>
    answerWords.some((word) => word.includes(keyword) || keyword.includes(word)),
  )

  // Also check for random/nonsensical content
  const randomPhrases = ["random", "test", "hello", "nothing", "idk", "i don't know", "whatever"]
  const hasRandomContent = randomPhrases.some((phrase) => answer.includes(phrase))

  return (commonWords.length === 0 && answerWords.length > 5) || hasRandomContent
}

function extractKeywords(question: string): string[] {
  const stopWords = [
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "how",
    "what",
    "why",
    "when",
    "where",
    "would",
    "could",
    "should",
  ]
  return question
    .split(" ")
    .filter((word) => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5) // Take top 5 keywords
}

function checkIfStructured(answer: string): boolean {
  // Check for structure indicators
  const structureIndicators = [
    "first",
    "second",
    "third",
    "finally",
    "firstly",
    "secondly",
    "thirdly",
    "initially",
    "then",
    "next",
    "lastly",
    "because",
    "therefore",
    "however",
    "moreover",
    "for example",
    "such as",
    "in conclusion",
  ]

  return (
    structureIndicators.some((indicator) => answer.toLowerCase().includes(indicator)) || answer.split(".").length > 3
  ) // Multiple sentences suggest structure
}

function checkIfHasExamples(answer: string): boolean {
  const exampleIndicators = [
    "for example",
    "such as",
    "like",
    "including",
    "instance",
    "case",
    "project",
    "experience",
    "worked on",
    "built",
    "designed",
    "implemented",
  ]

  return exampleIndicators.some((indicator) => answer.includes(indicator))
}

function generateRealisticOverallImpression(score: number, branch: AcademicBranch, analysis: any): string {
  if (analysis.hasBlankAnswers) {
    return `Your interview performance needs significant improvement. Several questions were left unanswered or had minimal responses. In a real interview, this would be concerning to employers. Please ensure you provide substantive answers to all questions, even if you need to think through your response.`
  }

  if (analysis.hasIrrelevantAnswers) {
    return `Your responses did not consistently address the questions asked. In interviews, it's crucial to listen carefully and provide relevant answers. Practice active listening and ensure your responses directly relate to what the interviewer is asking about ${branch}.`
  }

  if (score >= 85) {
    return `Excellent interview performance! You demonstrated strong technical knowledge in ${branch}, provided well-structured responses, and communicated clearly. Your answers show both depth of understanding and practical application. You're well-prepared for real interviews.`
  } else if (score >= 70) {
    return `Good interview performance with solid technical foundation in ${branch}. Your responses show understanding of key concepts, though there's room for improvement in providing more detailed examples and technical depth. With some additional practice, you'll be very competitive.`
  } else if (score >= 50) {
    return `Your interview shows basic understanding but needs improvement in several areas. Focus on providing more detailed, technically accurate responses with concrete examples. Review fundamental ${branch} concepts and practice articulating your knowledge more clearly.`
  } else {
    return `Your interview performance indicates significant preparation is needed. The responses lacked technical depth and clarity expected for ${branch} positions. Consider reviewing core concepts, practicing with mock interviews, and working on communication skills before real interviews.`
  }
}

function getTechnicalTermsForBranch(branch: AcademicBranch): string[] {
  const terms = {
    "Computer Science": ["algorithm", "data structure", "database", "API", "framework", "optimization", "scalability"],
    "Electronics Engineering": ["circuit", "microcontroller", "signal", "frequency", "amplifier", "PCB", "embedded"],
    "Mechanical Engineering": ["thermodynamics", "stress", "material", "manufacturing", "CAD", "design", "analysis"],
    "Civil Engineering": ["structural", "foundation", "concrete", "steel", "load", "construction", "surveying"],
    "Chemical Engineering": [
      "process",
      "reaction",
      "mass transfer",
      "heat transfer",
      "distillation",
      "reactor",
      "optimization",
    ],
    "Electrical Engineering": ["power", "voltage", "current", "motor", "transformer", "control", "protection"],
    "Aerospace Engineering": ["aerodynamics", "propulsion", "orbital", "flight", "spacecraft", "materials", "systems"],
    "Biomedical Engineering": [
      "biocompatibility",
      "medical device",
      "biomechanics",
      "imaging",
      "regulatory",
      "clinical",
      "patient",
    ],
  }

  return terms[branch] || terms["Computer Science"]
}
