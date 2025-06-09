"use server"

import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyCijTMg8VuknhbvjCcBrlCSPtSa6xzVhrg",
})

const AnalysisSchema = z.object({
  ingredients: z.array(
    z.object({
      ingredient: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
      explanation: z.string(),
      healthImpacts: z.array(z.string()),
      alternatives: z.string().optional(),
      specificAdditives: z.array(z.string()).optional(),
      estimatedAmount: z.string().optional(), // e.g., "high", "moderate", "trace"
      dailyIntakeImpact: z.string().optional(),
    }),
  ),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  productType: z.string().optional(),
  commonAdditives: z.array(z.string()).optional(),
  scoringReasoning: z.string(),
  artificialColors: z.array(z.string()).optional(),
  artificialFlavors: z.array(z.string()).optional(),
  preservatives: z.array(z.string()).optional(),
  nutritionalConcerns: z
    .array(
      z.object({
        nutrient: z.string(),
        amount: z.string(),
        dailyValuePercentage: z.number().optional(),
        concern: z.string(),
      }),
    )
    .optional(),
  servingSize: z.string().optional(),
  estimatedCalories: z.number().optional(),
})

export async function analyzeIngredients(ingredientText: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: AnalysisSchema,
      prompt: `You are a food safety expert conducting a FRESH, COMPREHENSIVE analysis. You must NEVER use shortcuts or pre-written responses. Analyze every product from scratch using your knowledge of food science and nutrition.

INPUT: "${ingredientText}"

CRITICAL INSTRUCTIONS:
1. ALWAYS perform a complete, independent analysis - never use template responses
2. Research the actual formulation and ingredients for this specific product
3. Calculate health impacts based on typical serving sizes and consumption patterns
4. Provide specific nutritional data when possible (sodium, sugar, caffeine, etc.)
5. Assess each ingredient individually for health risks and daily intake impact

ANALYSIS FRAMEWORK:

STEP 1: PRODUCT IDENTIFICATION & FORMULATION RESEARCH
- Identify the exact product type and typical formulation
- Research actual ingredients used in this product category/brand
- Consider regional variations in formulations
- Estimate typical serving size and consumption frequency

STEP 2: COMPREHENSIVE INGREDIENT BREAKDOWN
For each ingredient, provide:
- Specific chemical name and function in the product
- Health risk assessment based on current scientific literature
- Estimated quantity/concentration in the product
- Daily intake implications (how much of daily limits this represents)
- Specific health impacts and mechanisms

STEP 3: NUTRITIONAL IMPACT ASSESSMENT
Calculate and report:
- Estimated calories per serving
- Key nutrients of concern (sodium, sugar, caffeine, artificial sweeteners)
- Percentage of daily recommended limits
- Cumulative health impact if consumed regularly

STEP 4: DETAILED RISK ANALYSIS
- Immediate health effects
- Long-term consumption risks
- Vulnerable population concerns (children, pregnant women, etc.)
- Interaction effects between ingredients

INGREDIENT-SPECIFIC ANALYSIS REQUIREMENTS:

ARTIFICIAL SWEETENERS:
- Specify exact type (aspartame/E951, sucralose/E955, etc.)
- Calculate ADI (Acceptable Daily Intake) impact
- Note any metabolism concerns or contraindications

ARTIFICIAL COLORS:
- Identify specific dyes (Red 40/E129, Yellow 5/E102, etc.)
- Reference hyperactivity studies and regulatory status
- Note any banned regions or restrictions

PRESERVATIVES:
- Specify exact preservatives and concentrations
- Assess oxidative stress potential
- Note any allergenic or carcinogenic concerns

CAFFEINE:
- Calculate exact mg content per serving
- Compare to daily safe limits (400mg adults, 100mg adolescents)
- Note interaction with other stimulants

SODIUM:
- Estimate sodium content from all sources
- Calculate percentage of 2300mg daily limit
- Assess cardiovascular impact

ADDED SUGARS:
- Distinguish between natural and added sugars
- Calculate percentage of 50g daily limit (WHO recommendation)
- Assess metabolic impact

SCORING METHODOLOGY (Must be evidence-based):
- 90-100: Whole foods, minimal processing, high nutritional value
- 80-89: Lightly processed, mostly beneficial ingredients
- 70-79: Moderately processed, some nutritional value
- 60-69: Processed foods with mixed health impacts
- 50-59: Highly processed, limited nutritional value
- 40-49: Multiple concerning ingredients, regular consumption not recommended
- 30-39: Significant health risks, occasional consumption only
- 20-29: High risk ingredients, avoid regular consumption
- 10-19: Severe health concerns, not recommended
- 0-9: Dangerous ingredients, avoid completely

PRODUCT EXAMPLES (Analyze fresh each time):
- Diet sodas: Focus on artificial sweetener load, phosphoric acid, caffeine
- Energy drinks: Caffeine content, taurine, artificial colors, sugar/sweetener load
- Processed snacks: Trans fats, sodium, artificial flavors, preservatives
- Chocolate products: Sugar content, milk allergens, processing aids

DAILY INTAKE CONTEXT:
For each concerning ingredient, specify:
- How much this product contributes to daily intake
- What other common foods contain this ingredient
- Cumulative risk if consuming multiple sources
- Recommendations for daily limits

Remember: Every analysis must be thorough, evidence-based, and specific to the actual product formulation. Do not use generic responses or skip detailed assessment of any ingredient.`,
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
