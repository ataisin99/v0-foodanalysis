"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Search, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Moving Gradient Orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse right-0 bottom-0"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
            transition: "transform 0.3s ease-out",
            animationDelay: "1s",
          }}
        />

        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={`${i * 25}%`}
              y1="0%"
              x2={`${i * 25 + 20}%`}
              y2="100%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              AI-Powered Food Safety
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-600 leading-tight">
              <span className="relative inline-block">
                Know What You're Eating
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse" />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Instantly analyze food ingredients with AI to understand health risks, make informed choices, and protect
              your family's wellbeing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analyze">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
              >
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">Free • No signup required • Instant results</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Instant Analysis</h3>
              <p className="text-gray-600">
                Simply paste your ingredient list and get comprehensive health risk analysis in seconds using advanced
                AI.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Risk Assessment</h3>
              <p className="text-gray-600">
                Get detailed risk levels for each ingredient with scientific explanations and health impact assessments.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Safety Scoring</h3>
              <p className="text-gray-600">
                Receive an overall safety score (0-100) to quickly understand the healthiness of your food choices.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Achieve Section */}
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Help You Achieve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empowering you to make informed food choices for a healthier lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Avoid Harmful Ingredients</h3>
                <p className="text-gray-600">
                  Identify potentially dangerous additives, preservatives, and chemicals before they reach your table.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Protect Your Family</h3>
                <p className="text-gray-600">
                  Make safer food choices for your loved ones with science-backed ingredient analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Understand Food Labels</h3>
                <p className="text-gray-600">
                  Decode complex ingredient lists and understand what those chemical names really mean.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Make Informed Decisions</h3>
                <p className="text-gray-600">
                  Get clear, actionable insights to choose healthier alternatives and improve your diet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to Take Control of Your Food Choices?</h2>
          <Link href="/analyze">
            <Button
              size="lg"
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200"
            >
              Analyze Your Food Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
