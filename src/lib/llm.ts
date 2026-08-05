// Simple provider-abstracted LLM caller. Currently supports Google Gemini
// (generous free tier, called directly from the browser via REST/fetch).
// To add Claude/Groq/etc later: add a case in callLLM() and a matching
// getXApiKey()/setXApiKey() pair below.

export type LLMProvider = 'gemini'

export interface CallLLMOptions {
  provider?: LLMProvider
  model?: string
  temperature?: number
}

const GEMINI_KEY_STORAGE = 'upsc-gemini-api-key'
const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash'

export function getGeminiApiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || ''
}

export function setGeminiApiKey(key: string) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key)
}

export function hasApiKey(): boolean {
  return getGeminiApiKey().trim().length > 0
}

export class LLMError extends Error {}

async function callGemini(prompt: string, opts: CallLLMOptions): Promise<string> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new LLMError('NO_API_KEY')
  }
  const model = opts.model || GEMINI_DEFAULT_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.7,
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new LLMError(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') ?? ''
  if (!text) {
    throw new LLMError('Gemini returned an empty response.')
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
