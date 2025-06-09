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
})

export async function analyzeIngredients(ingredientText: string) {
  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: AnalysisSchema,
      prompt: `You are a food safety expert with comprehensive knowledge of actual product formulations. Analyze the following food product or ingredients for health risks and safety:

INPUT: "${ingredientText}"

CRITICAL: You must use ACCURATE ingredient information for known products. Do NOT make assumptions about ingredients that contradict the product's nature.

PRODUCT-SPECIFIC KNOWLEDGE (Use actual formulations):

DIET/SUGAR-FREE PRODUCTS:
- Diet Coke: Contains aspartame/E951, acesulfame potassium/E950, phosphoric acid, natural flavors, caffeine, caramel color/E150d - NO SUGAR OR HFCS
- Diet Pepsi: Contains aspartame/E951, acesulfame potassium/E950, phosphoric acid, natural flavors, caffeine - NO SUGAR OR HFCS
- Sugar-free gum: Contains xylitol, sorbitol, aspartame - NO SUGAR
- Zero-calorie drinks: Use artificial sweeteners, not sugar

REGULAR SUGARY PRODUCTS:
- Regular Coke: High fructose corn syrup, phosphoric acid, natural flavors, caffeine, caramel color/E150d
- Regular Pepsi: High fructose corn syrup, phosphoric acid, natural flavors, caffeine, caramel color/E150d

TURKISH PRODUCTS (Ülker brand examples):
- Ülker Gofret: Wheat flour, sugar, vegetable oils (palm), cocoa powder, artificial vanilla flavor, soy lecithin/E322, baking powder
- Ülker Çikolata: Sugar, cocoa mass, cocoa butter, milk powder, soy lecithin/E322, vanilla flavor

COMMON PRODUCT CATEGORIES:
- Wafer cookies: Wheat flour, sugar, palm oil, artificial flavors (vanillin), soy lecithin
- Chocolate bars: Sugar, cocoa, milk powder, soy lecithin, artificial flavors
- Energy drinks: Caffeine, taurine, artificial sweeteners OR sugar, artificial colors (Red 40, Blue 1)
- Chips: Potatoes, vegetable oil, salt, artificial flavors, preservatives (BHT/E321)

ANALYSIS INSTRUCTIONS:

1. PRODUCT IDENTIFICATION & ACCURACY CHECK:
   - If analyzing a specific brand/product, use ACTUAL known ingredients
   - For "Diet" products: NO sugar, high fructose corn syrup, or caloric sweeteners
   - For "Sugar-free": Uses artificial sweeteners (aspartame, sucralose, etc.)
   - For "Regular" versions: Contains actual sugars/HFCS
   - If unsure about specific formulation, state "typical ingredients may include" rather than making false claims

2. INGREDIENT BREAKDOWN - Be HIGHLY SPECIFIC and ACCURATE:
   - Primary ingredients (exact types based on actual product knowledge)
   - SPECIFIC artificial colors (e.g., "Red 40/E129", "Yellow 5/E102", "Caramel Color/E150d")
   - SPECIFIC artificial flavors (e.g., "vanillin", "ethyl vanillin", "natural flavors")
   - SPECIFIC preservatives (e.g., "BHA/E320", "sodium benzoate/E211", "phosphoric acid")
   - SPECIFIC sweeteners - DISTINGUISH between:
     * Regular products: "high fructose corn syrup", "sugar", "glucose syrup"
     * Diet products: "aspartame/E951", "sucralose/E955", "acesulfame potassium/E950"
   - Include E-numbers for European additives when applicable

3. ACCURACY VALIDATION:
   - Double-check that ingredients match the product type
   - Diet/Zero products should NEVER contain sugar or HFCS
   - Regular products typically contain sugar/HFCS, not artificial sweeteners
   - If uncertain about specific ingredients, indicate this clearly

4. SCORING CRITERIA (BE SPECIFIC AND VARIED):

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
- Multiple artificial additives, excessive sugar/caffeine OR multiple artificial sweeteners
- Known harmful preservatives, artificial colors linked to health issues

SCORE 0-9: Severe health concerns
- Products with banned substances, excessive harmful additives

5. PRODUCT-SPECIFIC SCORING EXAMPLES:
   - Diet Coke: 25-35 (artificial sweeteners, phosphoric acid, caffeine, but no sugar)
   - Regular Coke: 15-25 (high sugar, phosphoric acid, artificial flavors)
   - Ülker Gofret: 35-45 (high sugar, palm oil, artificial flavors)
   - Fresh apple: 95-100 (whole food, minimal processing)
   - Whole grain bread: 75-85 (some processing, generally healthy)

IMPORTANT: 
- For Diet Coke specifically: Contains aspartame, acesulfame potassium, phosphoric acid, natural flavors, caffeine, caramel color - NO SUGAR OR HFCS
- For any "diet" or "zero" product: Use artificial sweeteners, not sugar
- Always verify ingredient accuracy against product type before finalizing analysis

Provide detailed reasoning for your score in the scoringReasoning field, ensuring ingredients match the actual product formulation.`,
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
