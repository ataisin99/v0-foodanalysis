"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Info,
  Lightbulb,
  Calculator,
  Droplets,
  Palette,
  FlaskConical,
} from "lucide-react"
import { analyzeIngredients } from "../actions/analyze-ingredients"
import Link from "next/link"

interface AnalysisResult {
  ingredient: string
  riskLevel: "Low" | "Medium" | "High"
  explanation: string
  healthImpacts: string[]
  alternatives?: string
  specificAdditives?: string[]
}

interface AnalysisData {
  ingredients: AnalysisResult[]
  overallScore: number
  summary: string
  productType?: string
  commonAdditives?: string[]
  scoringReasoning?: string
  artificialColors?: string[]
  artificialFlavors?: string[]
  preservatives?: string[]
}

export default function AnalyzePage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [overallScore, setOverallScore] = useState<number | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [productType, setProductType] = useState<string>("")
  const [commonAdditives, setCommonAdditives] = useState<string[]>([])
  const [scoringReasoning, setScoringReasoning] = useState<string>("")
  const [artificialColors, setArtificialColors] = useState<string[]>([])
  const [artificialFlavors, setArtificialFlavors] = useState<string[]>([])
  const [preservatives, setPreservatives] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setIsAnalyzing(true)

    try {
      const result = await analyzeIngredients(inputText)

      if (result.success && result.data) {
        setResults(result.data.ingredients)
        setOverallScore(result.data.overallScore)
        setSummary(result.data.summary)
        setProductType(result.data.productType || "")
        setCommonAdditives(result.data.commonAdditives || [])
        setScoringReasoning(result.data.scoringReasoning || "")
        setArtificialColors(result.data.artificialColors || [])
        setArtificialFlavors(result.data.artificialFlavors || [])
        setPreservatives(result.data.preservatives || [])
      } else {
        // Handle error case
        console.error("Analysis failed:", result.error)
        setResults([])
        setOverallScore(null)
        setSummary("")
        setProductType("")
        setCommonAdditives([])
        setScoringReasoning("")
        setArtificialColors([])
        setArtificialFlavors([])
        setPreservatives([])
      }
    } catch (error) {
      console.error("Error during analysis:", error)
      setResults([])
      setOverallScore(null)
      setSummary("")
      setProductType("")
      setCommonAdditives([])
      setScoringReasoning("")
      setArtificialColors([])
      setArtificialFlavors([])
      setPreservatives([])
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
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-green-500"
    if (score >= 50) return "text-yellow-600"
    if (score >= 30) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Excellent - Very healthy choice"
    if (score >= 70) return "Good - Generally safe with minor concerns"
    if (score >= 50) return "Fair - Moderate concerns, consume in moderation"
    if (score >= 30) return "Poor - Multiple health concerns, limit consumption"
    return "Very Poor - Significant health risks, avoid if possible"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl space-y-6">
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
          <p className="text-gray-600">
            Enter product names, brands, or ingredient lists for comprehensive health analysis
          </p>
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <strong>Data Sources:</strong> FDA GRAS database, EFSA assessments, WHO/FAO evaluations, peer-reviewed food
            safety research
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'Ülker Gofret', 'Coca Cola', 'Apple', or full ingredient list..."
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
            {/* Product Type & Summary */}
            {(productType || summary) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {productType && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Product Type:</h4>
                      <p className="text-gray-700">{productType}</p>
                    </div>
                  )}
                  {summary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Overall Assessment:</h4>
                      <p className="text-gray-700">{summary}</p>
                    </div>
                  )}

                  {/* Artificial Colors Section */}
                  {artificialColors && artificialColors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-red-500" />
                        Artificial Colors:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {artificialColors.map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-red-50">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artificial Flavors Section */}
                  {artificialFlavors && artificialFlavors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-purple-500" />
                        Artificial Flavors:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {artificialFlavors.map((flavor, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50">
                            {flavor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preservatives Section */}
                  {preservatives && preservatives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-amber-500" />
                        Preservatives:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {preservatives.map((preservative, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-amber-50">
                            {preservative}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Additives Section */}
                  {commonAdditives && commonAdditives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Other Additives:</h4>
                      <div className="flex flex-wrap gap-2">
                        {commonAdditives.map((additive, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {additive}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                      <Progress value={overallScore} className="h-3 mb-2" />
                      <p className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
                        {getScoreDescription(overallScore)}
                      </p>
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
                          stroke={
                            overallScore >= 85
                              ? "#10b981"
                              : overallScore >= 70
                                ? "#22c55e"
                                : overallScore >= 50
                                  ? "#f59e0b"
                                  : overallScore >= 30
                                    ? "#f97316"
                                    : "#ef4444"
                          }
                          strokeWidth="2"
                          strokeDasharray={`${overallScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Scoring Reasoning */}
                  {scoringReasoning && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                        <Calculator className="h-4 w-4" />
                        Scoring Reasoning:
                      </h4>
                      <p className="text-gray-700 text-sm">{scoringReasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Ingredient Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900">{result.ingredient}</h3>
                        <Badge variant={getRiskColor(result.riskLevel)} className="flex items-center gap-1">
                          {getRiskIcon(result.riskLevel)}
                          {result.riskLevel} Risk
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Analysis:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{result.explanation}</p>
                        </div>

                        {/* Specific Additives */}
                        {result.specificAdditives && result.specificAdditives.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Specific Additives:</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {result.specificAdditives.map((additive, addIndex) => (
                                <Badge key={addIndex} variant="outline" className="text-xs bg-blue-50">
                                  {additive}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.healthImpacts && result.healthImpacts.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Health Impacts:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.healthImpacts.map((impact, impactIndex) => (
                                <li key={impactIndex} className="text-gray-700 text-sm">
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.alternatives && (
                          <div className="bg-green-50 p-3 rounded-md">
                            <h4 className="font-medium text-green-900 mb-1 flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              Healthier Alternatives:
                            </h4>
                            <p className="text-green-800 text-sm">{result.alternatives}</p>
                          </div>
                        )}
                      </div>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Deep Analysis</h3>
              <p className="text-gray-600 mb-4">
                Enter any product name, brand, or ingredient list for comprehensive health analysis.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <strong>Test Examples (with expected scores):</strong>
                </p>
                <p>• "Fresh Apple" → Should score 95-100</p>
                <p>• "Ülker Gofret" → Should score 35-45</p>
                <p>• "Coca Cola" → Should score 15-25</p>
                <p>• "Whole grain bread" → Should score 75-85</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
