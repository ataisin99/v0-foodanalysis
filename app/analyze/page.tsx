"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { analyzeIngredients } from "../actions/analyze-ingredients"
import Link from "next/link"

interface AnalysisResult {
  ingredient: string
  riskLevel: "Low" | "Medium" | "High"
  explanation: string
}

export default function AnalyzePage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [overallScore, setOverallScore] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setIsAnalyzing(true)

    try {
      const result = await analyzeIngredients(inputText)

      if (result.success && result.data) {
        setResults(result.data.ingredients)
        setOverallScore(result.data.overallScore)
      } else {
        // Handle error case
        console.error("Analysis failed:", result.error)
        setResults([])
        setOverallScore(null)
      }
    } catch (error) {
      console.error("Error during analysis:", error)
      setResults([])
      setOverallScore(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "default"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return <XCircle className="h-4 w-4" />
      case "Medium":
        return <AlertTriangle className="h-4 w-4" />
      case "Low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Food Ingredient Analysis</h1>
          <p className="text-gray-600">Enter ingredients or product information to analyze potential health risks</p>
        </div>

        {/* Input Section */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ingredients list or product name..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isAnalyzing || !inputText.trim()}>
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Overall Score */}
            {overallScore !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Overall Safety Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Safety Rating</span>
                        <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}/100</span>
                      </div>
                      <Progress value={overallScore} className="h-3" />
                    </div>
                    <div className="relative h-20 w-20">
                      <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="2"
                          strokeDasharray={`${overallScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredient Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b font-semibold text-sm text-gray-600">
                    <div>Ingredient</div>
                    <div>Risk Level</div>
                    <div className="md:col-span-2">Explanation</div>
                  </div>

                  {/* Data Rows */}
                  {results.map((result, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-3 border-b last:border-b-0">
                      <div className="font-medium text-gray-900">{result.ingredient}</div>
                      <div>
                        <Badge variant={getRiskColor(result.riskLevel)} className="flex items-center gap-1 w-fit">
                          {getRiskIcon(result.riskLevel)}
                          {result.riskLevel}
                        </Badge>
                      </div>
                      <div className="md:col-span-2 text-gray-700 text-sm leading-relaxed">{result.explanation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isAnalyzing && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
              <p className="text-gray-600">
                Enter ingredients or product information above to get started with the analysis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
