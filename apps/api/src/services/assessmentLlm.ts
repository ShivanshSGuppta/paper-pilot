import { env } from "../config/env";
import { logger } from "../config/logger";
import { LlmPromptBundle, normalizeGeneratedPayload } from "@vedaai/shared";

export type LlmGenerationResult = {
  text: string;
  provider: string;
};

export interface AssessmentLlmProvider {
  generate(bundle: LlmPromptBundle): Promise<LlmGenerationResult>;
}

class OpenAiCompatibleProvider implements AssessmentLlmProvider {
  async generate(bundle: LlmPromptBundle): Promise<LlmGenerationResult> {
    const response = await fetch(
      `${env.LLM_BASE_URL}/models/${env.LLM_MODEL}:generateContent`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.LLM_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${bundle.system}\n\n${bundle.user}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM request failed: ${response.status} ${errorText}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!text) {
      throw new Error("LLM returned an empty response.");
    }
    return { provider: "gemini", text };
  }
}

export function getAssessmentLlmProvider(): AssessmentLlmProvider {
  if (!env.LLM_API_KEY) {
    logger.error("LLM_API_KEY is required for generation.");
    throw new Error("LLM_API_KEY is required for generation.");
  }
  return new OpenAiCompatibleProvider();
}

export function coerceProviderResultToText(result: LlmGenerationResult) {
  return result.text;
}

export function normalizeProviderPayload(input: unknown) {
  return normalizeGeneratedPayload(input);
}
