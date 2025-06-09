"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Zap,
  Droplets,
  Palette,
} from "lucide-react"
import Link from "next/link"

interface SavedProduct {
  id: string
  name: string
  analysisData: any
  timestamp: number
}

interface DailyIntake {
  caffeine: number
  sodium: number
  addedSugars: number
  artificialSweeteners: number
  artificialColors: number
  preservatives: number
}

interface DailyLimits {
  caffeine: { limit: number; unit: string; source: string }
  sodium: { limit: number; unit: string; source: string }
  addedSugars: { limit: number; unit: string; source: string }
  artificialSweeteners: { limit: number; unit: string; source: string }
}

const DAILY_LIMITS: DailyLimits = {
  caffeine: { limit: 400, unit: "mg", source: "FDA" },
  sodium: { limit: 2300, unit: "mg", source: "WHO" },
  addedSugars: { limit: 50, unit: "g", source: "WHO" },
  artificialSweeteners: { limit: 40, unit: "mg/kg body weight", source: "FDA (ADI)" },
}

export default function TrackingPage() {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>({
    caffeine: 0,
    sodium: 0,
    addedSugars: 0,
    artificialSweeteners: 0,
    artificialColors: 0,
    preservatives: 0,
  })

  useEffect(() => {
    loadSavedProducts()
  }, [])

  useEffect(() => {
    calculateDailyIntake()
  }, [savedProducts, selectedDate])

  const loadSavedProducts = () => {
    const products = JSON.parse(localStorage.getItem("savedProducts") || "[]")
    setSavedProducts(products)
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = savedProducts.filter((product) => product.id !== id)
    setSavedProducts(updatedProducts)
    localStorage.setItem("savedProducts", JSON.stringify(updatedProducts))
  }

  const calculateDailyIntake = () => {
    const selectedDateTimestamp = new Date(selectedDate).getTime()
    const nextDayTimestamp = selectedDateTimestamp + 24 * 60 * 60 * 1000

    const todaysProducts = savedProducts.filter(
      (product) => product.timestamp >= selectedDateTimestamp && product.timestamp < nextDayTimestamp,
    )

    const intake: DailyIntake = {
      caffeine: 0,
      sodium: 0,
      addedSugars: 0,
      artificialSweeteners: 0,
      artificialColors: 0,
      preservatives: 0,
    }

    todaysProducts.forEach((product) => {
      const data = product.analysisData

      // Estimate intake based on nutritional concerns
      if (data.nutritionalConcerns) {
        data.nutritionalConcerns.forEach((concern: any) => {
          const nutrient = concern.nutrient.toLowerCase()
          if (nutrient.includes("caffeine")) {
            intake.caffeine += Number.parseFloat(concern.amount.match(/\d+/)?.[0] || "0")
          } else if (nutrient.includes("sodium")) {
            intake.sodium += Number.parseFloat(concern.amount.match(/\d+/)?.[0] || "0")
          } else if (nutrient.includes("sugar")) {
            intake.addedSugars += Number.parseFloat(concern.amount.match(/\d+/)?.[0] || "0")
          }
        })
      }

      // Count artificial additives
      if (data.artificialColors) {
        intake.artificialColors += data.artificialColors.length
      }
      if (data.preservatives) {
        intake.preservatives += data.preservatives.length
      }
      if (data.artificialFlavors) {
        intake.artificialSweeteners += data.artificialFlavors.filter(
          (flavor: string) => flavor.toLowerCase().includes("aspartame") || flavor.toLowerCase().includes("sucralose"),
        ).length
      }
    })

    setDailyIntake(intake)
  }

  const getIntakePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const getIntakeColor = (percentage: number) => {
    if (percentage > 100) return "text-red-600"
    if (percentage > 75) return "text-orange-600"
    if (percentage > 50) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return "bg-red-500"
    if (percentage > 75) return "bg-orange-500"
    if (percentage > 50) return "bg-yellow-500"
    return "bg-green-500"
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const todaysProducts = savedProducts.filter((product) => {
    const productDate = new Date(product.timestamp).toISOString().split("T")[0]
    return productDate === selectedDate
  })

  const getWarnings = () => {
    const warnings = []

    if (dailyIntake.caffeine > DAILY_LIMITS.caffeine.limit) {
      warnings.push(
        `Caffeine intake (${dailyIntake.caffeine}mg) exceeds FDA daily limit of ${DAILY_LIMITS.caffeine.limit}mg`,
      )
    }

    if (dailyIntake.sodium > DAILY_LIMITS.sodium.limit) {
      warnings.push(`Sodium intake (${dailyIntake.sodium}mg) exceeds WHO daily limit of ${DAILY_LIMITS.sodium.limit}mg`)
    }

    if (dailyIntake.addedSugars > DAILY_LIMITS.addedSugars.limit) {
      warnings.push(
        `Added sugars (${dailyIntake.addedSugars}g) exceed WHO daily limit of ${DAILY_LIMITS.addedSugars.limit}g`,
      )
    }

    if (dailyIntake.artificialColors > 3) {
      warnings.push(`High artificial color exposure (${dailyIntake.artificialColors} different colors today)`)
    }

    if (dailyIntake.preservatives > 5) {
      warnings.push(`High preservative exposure (${dailyIntake.preservatives} different preservatives today)`)
    }

    return warnings
  }

  const warnings = getWarnings()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/analyze">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analysis
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Daily Intake Tracking</h1>
          <p className="text-gray-600">Monitor your daily consumption of ingredients and chemicals</p>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Daily Limit Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Daily Intake Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                Caffeine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{dailyIntake.caffeine}mg</span>
                  <span className="text-sm text-gray-500">/ {DAILY_LIMITS.caffeine.limit}mg</span>
                </div>
                <Progress
                  value={getIntakePercentage(dailyIntake.caffeine, DAILY_LIMITS.caffeine.limit)}
                  className="h-2"
                />
                <p
                  className={`text-xs ${getIntakeColor(getIntakePercentage(dailyIntake.caffeine, DAILY_LIMITS.caffeine.limit))}`}
                >
                  {getIntakePercentage(dailyIntake.caffeine, DAILY_LIMITS.caffeine.limit).toFixed(1)}% of FDA limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                Sodium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{dailyIntake.sodium}mg</span>
                  <span className="text-sm text-gray-500">/ {DAILY_LIMITS.sodium.limit}mg</span>
                </div>
                <Progress value={getIntakePercentage(dailyIntake.sodium, DAILY_LIMITS.sodium.limit)} className="h-2" />
                <p
                  className={`text-xs ${getIntakeColor(getIntakePercentage(dailyIntake.sodium, DAILY_LIMITS.sodium.limit))}`}
                >
                  {getIntakePercentage(dailyIntake.sodium, DAILY_LIMITS.sodium.limit).toFixed(1)}% of WHO limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-pink-600" />
                Added Sugars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{dailyIntake.addedSugars}g</span>
                  <span className="text-sm text-gray-500">/ {DAILY_LIMITS.addedSugars.limit}g</span>
                </div>
                <Progress
                  value={getIntakePercentage(dailyIntake.addedSugars, DAILY_LIMITS.addedSugars.limit)}
                  className="h-2"
                />
                <p
                  className={`text-xs ${getIntakeColor(getIntakePercentage(dailyIntake.addedSugars, DAILY_LIMITS.addedSugars.limit))}`}
                >
                  {getIntakePercentage(dailyIntake.addedSugars, DAILY_LIMITS.addedSugars.limit).toFixed(1)}% of WHO
                  limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                Artificial Additives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{dailyIntake.artificialColors + dailyIntake.preservatives}</div>
                <div className="text-xs text-gray-600">
                  {dailyIntake.artificialColors} colors, {dailyIntake.preservatives} preservatives
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    Colors: {dailyIntake.artificialColors}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Preservatives: {dailyIntake.preservatives}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Products Consumed Today ({todaysProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysProducts.length > 0 ? (
              <div className="space-y-4">
                {todaysProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(product.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            product.analysisData.overallScore >= 70
                              ? "bg-green-50"
                              : product.analysisData.overallScore >= 50
                                ? "bg-yellow-50"
                                : "bg-red-50"
                          }`}
                        >
                          Score: {product.analysisData.overallScore}/100
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {product.analysisData.artificialColors && product.analysisData.artificialColors.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Artificial Colors:</h4>
                          <div className="flex flex-wrap gap-1">
                            {product.analysisData.artificialColors.map((color: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs bg-red-50">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.analysisData.preservatives && product.analysisData.preservatives.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Preservatives:</h4>
                          <div className="flex flex-wrap gap-1">
                            {product.analysisData.preservatives.map((preservative: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs bg-amber-50">
                                {preservative}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.analysisData.nutritionalConcerns &&
                        product.analysisData.nutritionalConcerns.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Key Concerns:</h4>
                            <div className="space-y-1">
                              {product.analysisData.nutritionalConcerns
                                .slice(0, 2)
                                .map((concern: any, index: number) => (
                                  <div key={index} className="text-xs text-gray-600">
                                    {concern.nutrient}: {concern.amount}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products tracked for this date.</p>
                <p className="text-sm">Analyze and save products to see them here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Saved Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              All Saved Products ({savedProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedProducts.length > 0 ? (
              <div className="space-y-3">
                {savedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{formatDate(product.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Score: {product.analysisData.overallScore}/100</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products saved yet.</p>
                <p className="text-sm">Start analyzing products to build your tracking history.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
