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
    }),
  ),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  productType: z.string().optional(),
  commonAdditives: z.array(z.string()).optional(),
  scoringReasoning: z.string(),
})

export async function analyzeIngredients(ingredientText: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: AnalysisSchema,
      prompt: `You are a food safety expert with access to nutritional databases and food safety research. Analyze the following food product or ingredients for comprehensive health risks and safety:

INPUT: "${ingredientText}"

IMPORTANT: You must provide VARIED and ACCURATE scoring based on the actual health risks of the ingredients. DO NOT default to middle scores.

DATA SOURCES I'm using for this analysis:
- FDA GRAS (Generally Recognized as Safe) database knowledge
- European Food Safety Authority (EFSA) assessments
- WHO/FAO food additive evaluations
- Peer-reviewed nutritional and toxicological studies
- Known ingredient safety profiles from food science literature

ANALYSIS INSTRUCTIONS:

1. PRODUCT IDENTIFICATION:
   - If this is a brand name (like "Ülker Gofret", "Oreo", "Coca Cola"), identify the product type
   - Based on my knowledge of typical formulations for this product type, list likely ingredients
   - Consider standard industry practices for this product category

2. INGREDIENT BREAKDOWN - List typical ingredients for this product:
   - Primary ingredients (flour, sugar, oils, etc.)
   - Common additives (emulsifiers, preservatives, artificial flavors/colors)
   - Processing aids and stabilizers typically used
   - Sweeteners and flavor enhancers

3. SCORING CRITERIA (BE SPECIFIC AND VARIED):

SCORE 85-100: Whole foods, minimal processing
- Examples: Fresh fruits, vegetables, plain nuts, water
- Organic products with minimal additives

SCORE 70-84: Lightly processed, mostly safe ingredients
- Examples: Whole grain bread, plain yogurt, cheese
- Some natural preservatives, minimal artificial additives

SCORE 50-69: Moderately processed with some concerns
- Examples: Crackers with preservatives, flavored yogurt
- Contains artificial flavors, some preservatives, moderate sugar

SCORE 30-49: Highly processed with multiple concerning ingredients
- Examples: Most commercial cookies, chips, candy
- High sugar/sodium, artificial colors, multiple preservatives
- Trans fats, high fructose corn syrup

SCORE 10-29: Significant health risks
- Examples: Energy drinks, highly processed snacks
- Multiple artificial additives, excessive sugar/caffeine
- Known harmful preservatives, artificial colors linked to health issues

SCORE 0-9: Severe health concerns
- Products with banned substances, excessive harmful additives

4. SPECIFIC RISK FACTORS TO CONSIDER:
   - Sugar content (high sugar = lower score)
   - Artificial colors (especially Red 40, Yellow 5, Blue 1)
   - Preservatives (BHA, BHT, sodium benzoate)
   - Trans fats or hydrogenated oils
   - High sodium content
   - Artificial sweeteners (aspartame, sucralose)
   - Processing level (ultra-processed = lower score)

5. PRODUCT-SPECIFIC EXAMPLES:
   - Ülker Gofret (wafer cookies): Typically 35-45 (high sugar, palm oil, artificial flavors)
   - Coca Cola: Typically 15-25 (high sugar, phosphoric acid, artificial flavors)
   - Fresh apple: 95-100 (whole food, minimal processing)
   - Whole grain bread: 75-85 (some processing, generally healthy)
   - Oreo cookies: 25-35 (high sugar, artificial flavors, processed oils)

CALCULATE THE SCORE by considering:
- Number of concerning ingredients (more = lower score)
- Severity of health risks (artificial additives, high sugar, etc.)
- Processing level (ultra-processed foods score lower)
- Nutritional value (empty calories = lower score)

Provide detailed reasoning for your score in the scoringReasoning field.`,
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
