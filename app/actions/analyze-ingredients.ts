"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const AnalysisSchema = z.object({
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      explanation: z.string(),
    }),
  ),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
})

export async function analyzeIngredients(ingredientText: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: AnalysisSchema,
      prompt: `Analyze the following food ingredients or product information for health risks and safety:

"${ingredientText}"

For each ingredient identified:
1. Determine the risk level (Low, Medium, High) based on current scientific research
2. Provide a clear explanation of potential health impacts
3. Consider factors like: toxicity, allergens, processing chemicals, additives, preservatives

Provide an overall safety score (0-100) where:
- 80-100: Very safe, minimal concerns
- 60-79: Generally safe with minor concerns  
- 40-59: Moderate concerns, consume in moderation
- 20-39: Significant concerns, limit consumption
- 0-19: High risk, avoid if possible

Include a brief summary of the overall assessment.`,
    })

    return {
      success: true,
      data: object,
    }
  } catch (error) {
    console.error("Error analyzing ingredients:", error)
    return {
      success: false,
      error: "Failed to analyze ingredients. Please try again.",
    }
  }
}
