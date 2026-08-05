// Voice support for the AI Tutor, built on the browser's built-in Web Speech API.
// Zero cost, no API keys, no server. Speech recognition (microphone -> text) and
// speech synthesis (text -> spoken audio) are both provided by the OS/browser.
//
// Support reality (Aug 2026):
//  - Speech synthesis (speaking) is widely supported: Chrome, Edge, Safari (macOS + iOS), Android.
//  - Speech recognition (listening) works well on Chrome desktop/Android and Edge, but is
//    unreliable on iOS Safari and absent in Firefox. We detect and degrade gracefully:
//    the user can still type, and answers are still spoken aloud.

export type SpeechLang = 'en' | 'hi'

const LOCALE: Record<SpeechLang, string> = { en: 'en-IN', hi: 'hi-IN' }

/* ------------------------------------------------------------------ */
/* Minimal typings — the Web Speech API is not in TypeScript's DOM lib */
/* ------------------------------------------------------------------ */

interface SpeechRecognitionAlternativeLike { transcript: string }
interface SpeechRecognitionResultLike {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternativeLike
}
interface SpeechRecognitionResultListLike {
  readonly length: number
  [index: number]: SpeechRecognitionResultLike
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultListLike
}
interface SpeechRecognitionErrorEventLike { readonly error: string }

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/* ------------------------------- */
/* Capability detection            */
/* ------------------------------- */

export function isListeningSupported(): boolean {
  return getRecognitionCtor() !== null
}

export function isSpeakingSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** iOS Safari reports SpeechRecognition but it is unreliable in practice. */
export function isListeningFlaky(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document)
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua)
  return iOS && isSafari
}

/* ------------------------------- */
/* Listening (speech -> text)      */
/* ------------------------------- */

export interface ListenHandle { stop: () => void }

export interface ListenCallbacks {
  /** Fired repeatedly with the best-guess text so far (not final). */
  onPartial?: (text: string) => void
  /** Fired once with the final transcript when the user stops speaking. */
  onFinal: (text: string) => void
  /** Fired on error with a human-readable message. */
  onError?: (message: string) => void
  /** Always fired when the session ends, for any reason. */
  onEnd?: () => void
}

const ERROR_MESSAGES: Record<string, string> = {
  'no-speech': "I didn't catch anything — try speaking again.",
  'audio-capture': 'No microphone found. Check that a mic is connected and enabled.',
  'not-allowed': 'Microphone access was blocked. Allow mic permission in your browser settings.',
  'service-not-allowed': 'Microphone access was blocked by your browser or system settings.',
  network: 'Speech recognition needs an internet connection.',
  aborted: '',
}

export function startListening(lang: SpeechLang, cb: ListenCallbacks): ListenHandle | null {
  const Ctor = getRecognitionCtor()
  if (!Ctor) return null

  const rec = new Ctor()
  rec.lang = LOCALE[lang]
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 1

  let finalText = ''
  let settled = false

  rec.onresult = (e) => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i]
      const text = result[0]?.transcript ?? ''
      if (result.isFinal) finalText += text
      else interim += text
    }
    if (interim && cb.onPartial) cb.onPartial((finalText + interim).trim())
  }

  rec.onerror = (e) => {
    const msg = ERROR_MESSAGES[e.error] ?? `Speech recognition error: ${e.error}`
    if (msg && cb.onError) cb.onError(msg)
  }

  rec.onend = () => {
    if (!settled) {
      settled = true
      const text = finalText.trim()
      if (text) cb.onFinal(text)
    }
    cb.onEnd?.()
  }

  try {
    rec.start()
  } catch {
    // start() throws if a session is already running
    return null
  }

  return {
    stop: () => {
      try {
        rec.stop()
      } catch {
        /* already stopped */
      }
    },
  }
}

/* ------------------------------- */
/* Speaking (text -> speech)       */
/* ------------------------------- */

let voicesCache: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeakingSupported()) return []
  const v = window.speechSynthesis.getVoices()
  if (v.length) voicesCache = v
  return voicesCache
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = () => loadVoices()
}

/** Voices available for a language, best match first. */
export function getVoices(lang: SpeechLang): SpeechSynthesisVoice[] {
  const all = loadVoices()
  const prefix = lang === 'hi' ? 'hi' : 'en'
  const exact = all.filter((v) => v.lang.toLowerCase().replace('_', '-') === LOCALE[lang].toLowerCase())
  const sameLang = all.filter((v) => v.lang.toLowerCase().startsWith(prefix) && !exact.includes(v))
  return [...exact, ...sameLang]
}

export function hasVoiceFor(lang: SpeechLang): boolean {
  return getVoices(lang).length > 0
}

/**
 * Markdown and other symbols read badly aloud. Strip them to plain prose.
 */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/^\s*[-=]{3,}\s*$/gm, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Chromium silently truncates long utterances, so split into chunks that end
 * on sentence boundaries where possible.
 */
function chunkText(text: string, max = 180): string[] {
  const sentences = text.match(/[^.!?।\n]+[.!?।]*\s*/g) ?? [text]
  const chunks: string[] = []
  let current = ''
  for (const s of sentences) {
    if ((current + s).length > max && current) {
      chunks.push(current.trim())
      current = s
    } else {
      current += s
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks.filter(Boolean)
}

export interface SpeakOptions {
  rate?: number
  voiceURI?: string
  onEnd?: () => void
  onError?: (message: string) => void
}

/**
 * iOS requires the first utterance to originate from a user gesture. Call this
 * inside a click handler once, so later auto-speak is permitted.
 */
export function primeSpeech(): void {
  if (!isSpeakingSupported()) return
  try {
    const u = new SpeechSynthesisUtterance('')
    u.volume = 0
    window.speechSynthesis.speak(u)
  } catch {
    /* non-fatal */
  }
}

export function stopSpeaking(): void {
  if (!isSpeakingSupported()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* non-fatal */
  }
}

export function isSpeaking(): boolean {
  return isSpeakingSupported() && window.speechSynthesis.speaking
}

export function speak(text: string, lang: SpeechLang, opts: SpeakOptions = {}): void {
  if (!isSpeakingSupported()) {
    opts.onError?.('This browser cannot speak text aloud.')
    return
  }
  const clean = stripForSpeech(text)
  if (!clean) {
    opts.onEnd?.()
    return
  }

  stopSpeaking()

  const voices = getVoices(lang)
  const chosen = opts.voiceURI ? voices.find((v) => v.voiceURI === opts.voiceURI) ?? voices[0] : voices[0]

  if (!chosen && lang === 'hi') {
    opts.onError?.('No Hindi voice is installed on this device. Add a Hindi voice in your system settings, or switch the reply language to English.')
    return
  }

  const chunks = chunkText(clean)
  let index = 0

  const speakNext = () => {
    if (index >= chunks.length) {
      opts.onEnd?.()
      return
    }
    const u = new SpeechSynthesisUtterance(chunks[index++])
    u.lang = LOCALE[lang]
    if (chosen) u.voice = chosen
    u.rate = opts.rate ?? 1
    u.onend = speakNext
    u.onerror = (e) => {
      // 'interrupted'/'canceled' happen whenever we deliberately stop; not errors.
      const err = (e as unknown as { error?: string }).error
      if (err && err !== 'interrupted' && err !== 'canceled') {
        opts.onError?.(`Could not speak: ${err}`)
      }
      opts.onEnd?.()
    }
    window.speechSynthesis.speak(u)
  }

  speakNext()
}
