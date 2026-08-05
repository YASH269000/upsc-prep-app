// Simple provider-abstracted LLM caller. Currently supports Google Gemini
// (free tier, called directly from the browser via REST/fetch).
// To add Claude/Groq/etc later: add a case in callLLM() and a matching
// getXApiKey()/setXApiKey() pair below.

export type LLMProvider = 'gemini'

export interface CallLLMOptions {
  provider?: LLMProvider
  model?: string
  temperature?: number
}

const GEMINI_KEY_STORAGE = 'upsc-gemini-api-key'
const GEMINI_MODEL_STORAGE = 'upsc-gemini-model'

/**
 * Models with a usable free tier (verified Aug 2026 against
 * ai.google.dev/gemini-api/docs/models). Flash-Lite models carry the most
 * generous free daily quotas, so it is the default.
 *
 * Note: gemini-1.5-* and gemini-2.0-* are retired and now return 404/429.
 */
export const GEMINI_MODELS = [
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite — fastest, biggest free quota' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite — fast, large free quota' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash — smarter, smaller free quota' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash — newest, smaller free quota' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash — older, limited free quota' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite — older, fast' },
] as const

const GEMINI_DEFAULT_MODEL = GEMINI_MODELS[0].id

export function getGeminiApiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || ''
}

export function setGeminiApiKey(key: string) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key)
}

export function getGeminiModel(): string {
  const stored = localStorage.getItem(GEMINI_MODEL_STORAGE)
  // Migrate anyone still pinned to a retired model.
  if (!stored || !GEMINI_MODELS.some((m) => m.id === stored)) return GEMINI_DEFAULT_MODEL
  return stored
}

export function setGeminiModel(model: string) {
  localStorage.setItem(GEMINI_MODEL_STORAGE, model)
}

export function hasApiKey(): boolean {
  return getGeminiApiKey().trim().length > 0
}

export class LLMError extends Error {}

/** Turn raw Gemini HTTP failures into something a human can act on. */
function explainGeminiError(status: number, body: string, model: string): string {
  const lower = body.toLowerCase()

  if (status === 429) {
    return `Free quota used up for ${model}. This usually means either you have hit the daily limit, or requests were sent too quickly. Wait a minute and try again — or open Settings and switch to a different model (Flash-Lite models have the largest free quotas). You can check your remaining quota at aistudio.google.com/rate-limit`
  }
  if (status === 404 || lower.includes('is not found') || lower.includes('not supported')) {
    return `The model "${model}" is not available for your API key. Open Settings and pick a different model.`
  }
  if (status === 400 && (lower.includes('api_key_invalid') || lower.includes('api key not valid'))) {
    return 'That API key is not valid. Create a fresh one at aistudio.google.com/apikey and paste it into Settings again.'
  }
  if (status === 403) {
    return 'Your API key was rejected (403). Check that the Gemini API is enabled for the key’s project, or create a new key at aistudio.google.com/apikey'
  }
  if (status >= 500) {
    return 'Google’s servers returned an error. This is usually temporary — try again in a moment.'
  }
  return `Gemini API error (${status}): ${body.slice(0, 200)}`
}

async function callGemini(prompt: string, opts: CallLLMOptions): Promise<string> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new LLMError('NO_API_KEY')
  }
  const model = opts.model || getGeminiModel()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
        },
      }),
    })
  } catch {
    throw new LLMError('Could not reach Google’s servers. Check your internet connection.')
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new LLMError(explainGeminiError(res.status, errText, model))
  }

  const data = await res.json()

  // A response can come back with no text if it was blocked by safety filters.
  const blockReason = data?.promptFeedback?.blockReason
  if (blockReason) {
    throw new LLMError(`Gemini declined to answer that (${blockReason}). Try rephrasing the question.`)
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') ?? ''
  if (!text) {
    throw new LLMError('Gemini returned an empty response. Try rephrasing, or switch model in Settings.')
  }
  return text
}

/**
 * Provider-abstracted LLM call. Add new providers here.
 */
export async function callLLM(prompt: string, opts: CallLLMOptions = {}): Promise<string> {
  const provider = opts.provider || 'gemini'
  switch (provider) {
    case 'gemini':
      return callGemini(prompt, opts)
    default:
      throw new LLMError(`Unknown provider: ${provider}`)
  }
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}
