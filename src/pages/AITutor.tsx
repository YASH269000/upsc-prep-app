import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { db } from '../db/db'
import Card from '../components/Card'
import { callLLM, hasApiKey, isOnline, LLMError } from '../lib/llm'
import {
  getVoices,
  isListeningFlaky,
  isListeningSupported,
  isSpeakingSupported,
  primeSpeech,
  speak,
  startListening,
  stopSpeaking,
  type ListenHandle,
} from '../lib/speech'
import { Send, WifiOff, Trash2, Mic, Square, Volume2, VolumeX, Loader2 } from 'lucide-react'

type Mode = 'chat' | 'voice' | 'quiz-me' | 'evaluate'
type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking'

const RATE_KEY = 'voice-rate'
const VOICE_KEY = 'voice-uri'
const AUTOSPEAK_KEY = 'voice-autospeak'


/** LLM replies come back as markdown; render them instead of showing raw ** and ##. */
function Markdown({ text }: { text: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-hr:my-3">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}

export default function AITutor() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState<Mode>('chat')
  const [online, setOnline] = useState(isOnline())
  const [apiKeyPresent, setApiKeyPresent] = useState(hasApiKey())
  const [respondLang, setRespondLang] = useState<'en' | 'hi'>((i18n.language as 'en' | 'hi') || 'en')
  const [input, setInput] = useState('')
  const [topic, setTopic] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quizResult, setQuizResult] = useState('')
  const [evalResult, setEvalResult] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // ---- voice state ----
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [partial, setPartial] = useState('')
  const [dictating, setDictating] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(() => localStorage.getItem(AUTOSPEAK_KEY) === 'true')
  const [rate, setRate] = useState(() => Number(localStorage.getItem(RATE_KEY)) || 1)
  const [voiceURI, setVoiceURI] = useState(() => localStorage.getItem(VOICE_KEY) ?? '')
  const loopRef = useRef(false)
  const listenRef = useRef<ListenHandle | null>(null)
  const gotFinalRef = useRef(false)

  const canListen = isListeningSupported()
  const canSpeak = isSpeakingSupported()
  const listenFlaky = isListeningFlaky()
  const availableVoices = getVoices(respondLang)

  const messages = useLiveQuery(() => db.chatMessages.where('mode').equals('chat').sortBy('timestamp'), [])

  useEffect(() => {
    const onlineHandler = () => setOnline(true)
    const offlineHandler = () => setOnline(false)
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    }
  }, [])

  useEffect(() => {
    setApiKeyPresent(hasApiKey())
  }, [mode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => localStorage.setItem(RATE_KEY, String(rate)), [rate])
  useEffect(() => localStorage.setItem(VOICE_KEY, voiceURI), [voiceURI])
  useEffect(() => localStorage.setItem(AUTOSPEAK_KEY, String(autoSpeak)), [autoSpeak])

  const langName = (l: string) => (l === 'hi' ? 'Hindi' : 'English')

  /* ---------------- voice loop ---------------- */

  const stopVoice = useCallback(() => {
    loopRef.current = false
    listenRef.current?.stop()
    listenRef.current = null
    stopSpeaking()
    setVoiceState('idle')
    setPartial('')
  }, [])

  // Stop any audio when leaving the page or switching modes.
  useEffect(() => () => stopVoice(), [stopVoice])
  useEffect(() => {
    if (mode !== 'voice') stopVoice()
  }, [mode, stopVoice])

  const speakReply = useCallback(
    (text: string, onDone: () => void) => {
      if (!canSpeak) {
        onDone()
        return
      }
      setVoiceState('speaking')
      speak(text, respondLang, {
        rate,
        voiceURI: voiceURI || undefined,
        onEnd: onDone,
        onError: (m) => {
          setError(m)
          onDone()
        },
      })
    },
    [canSpeak, respondLang, rate, voiceURI],
  )

  const beginListen = useCallback(() => {
    if (!loopRef.current) return
    setError('')
    setPartial('')
    gotFinalRef.current = false
    setVoiceState('listening')

    const handle = startListening(respondLang, {
      onPartial: setPartial,
      onFinal: (text) => {
        gotFinalRef.current = true
        void handleVoiceTurn(text)
      },
      onError: (msg) => {
        setError(msg)
        stopVoice()
      },
      onEnd: () => {
        listenRef.current = null
        if (loopRef.current && !gotFinalRef.current) setVoiceState('idle')
      },
    })

    if (!handle) {
      setError(t('aiTutor.voiceUnsupported'))
      stopVoice()
      return
    }
    listenRef.current = handle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respondLang, stopVoice, t])

  const handleVoiceTurn = useCallback(
    async (text: string) => {
      setPartial('')
      setVoiceState('thinking')
      await db.chatMessages.add({ role: 'user', content: text, timestamp: Date.now(), mode: 'chat' })
      try {
        const prompt = `You are a UPSC (Indian Civil Services) exam tutor speaking aloud to a student. Answer in ${langName(
          respondLang,
        )}. Keep it conversational and under 120 words. Use plain sentences only — no markdown, no bullet points, no headings, no symbols — because your reply will be read aloud by a text-to-speech voice.\n\nStudent asked: ${text}`
        const reply = await callLLM(prompt)
        await db.chatMessages.add({ role: 'assistant', content: reply, timestamp: Date.now(), mode: 'chat' })
        speakReply(reply, () => {
          if (loopRef.current) beginListen()
          else setVoiceState('idle')
        })
      } catch (e) {
        setError(e instanceof LLMError ? e.message : String(e))
        stopVoice()
      }
    },
    [respondLang, speakReply, beginListen, stopVoice],
  )

  const startVoice = () => {
    primeSpeech()
    setError('')
    loopRef.current = true
    beginListen()
  }

  /* ---------------- dictation into the chat box ---------------- */

  const toggleDictation = () => {
    if (dictating) {
      listenRef.current?.stop()
      listenRef.current = null
      setDictating(false)
      return
    }
    primeSpeech()
    setError('')
    setPartial('')
    const handle = startListening(respondLang, {
      onPartial: setPartial,
      onFinal: (text) => setInput((prev) => (prev ? `${prev} ${text}` : text)),
      onError: (m) => setError(m),
      onEnd: () => {
        setDictating(false)
        setPartial('')
        listenRef.current = null
      },
    })
    if (!handle) {
      setError(t('aiTutor.voiceUnsupported'))
      return
    }
    listenRef.current = handle
    setDictating(true)
  }

  /* ---------------- text modes ---------------- */

  const handleSendChat = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setError('')
    await db.chatMessages.add({ role: 'user', content: userMsg, timestamp: Date.now(), mode: 'chat' })
    setLoading(true)
    try {
      const prompt = `You are a helpful, knowledgeable UPSC (Indian Civil Services) exam tutor. Answer the following question clearly and concisely, in ${langName(
        respondLang,
      )}. If relevant, mention which GS paper this topic relates to.\n\nQuestion: ${userMsg}`
      const reply = await callLLM(prompt)
      await db.chatMessages.add({ role: 'assistant', content: reply, timestamp: Date.now(), mode: 'chat' })
      if (autoSpeak && canSpeak) speak(reply, respondLang, { rate, voiceURI: voiceURI || undefined })
    } catch (e) {
      setError(e instanceof LLMError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleQuizMe = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setQuizResult('')
    try {
      const prompt = `Generate a short 5-question multiple choice quiz for UPSC exam preparation on the topic "${topic}". Respond in ${langName(
        respondLang,
      )}. For each question, give 4 options labeled A-D, indicate the correct answer, and a one-line explanation. Format clearly with numbering.`
      const reply = await callLLM(prompt)
      setQuizResult(reply)
    } catch (e) {
      setError(e instanceof LLMError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleEvaluate = async () => {
    if (!answerText.trim()) return
    setLoading(true)
    setError('')
    setEvalResult('')
    try {
      const prompt = `You are a UPSC Mains examiner. Evaluate the following answer written by a student. Score it out of 10 on three dimensions: Structure (intro-body-conclusion, use of headings/points), Relevance (does it address the question directly), and Clarity (language, coherence). Give a total score out of 10, and specific actionable feedback for improvement. Respond in ${langName(
        respondLang,
      )}.\n\nStudent's Answer:\n${answerText}`
      const reply = await callLLM(prompt)
      setEvalResult(reply)
    } catch (e) {
      setError(e instanceof LLMError ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = async () => {
    await db.chatMessages.where('mode').equals('chat').delete()
  }

  const replay = (text: string) => {
    primeSpeech()
    speak(text, respondLang, { rate, voiceURI: voiceURI || undefined, onError: setError })
  }

  const voiceStatusLabel: Record<VoiceState, string> = {
    idle: t('aiTutor.voiceTapToStart'),
    listening: t('aiTutor.voiceListening'),
    thinking: t('aiTutor.thinking'),
    speaking: t('aiTutor.voiceSpeaking'),
  }

  const lastAssistant = [...(messages ?? [])].reverse().find((m) => m.role === 'assistant')

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('aiTutor.title')}</h1>
        {!online && (
          <span className="flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/40 px-3 py-1 text-xs font-medium text-rose-700 dark:text-rose-300">
            <WifiOff size={13} /> {t('aiTutor.offline')}
          </span>
        )}
      </div>

      {!apiKeyPresent ? (
        <Card className="space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('aiTutor.noApiKey')}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('aiTutor.setupInstructions')}</p>
          <Link to="/settings" className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
            {t('aiTutor.goToSettings')}
          </Link>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {(['chat', 'voice', 'quiz-me', 'evaluate'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    mode === m ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m === 'chat'
                    ? t('aiTutor.chat')
                    : m === 'voice'
                      ? t('aiTutor.voice')
                      : m === 'quiz-me'
                        ? t('aiTutor.quizMe')
                        : t('aiTutor.evaluate')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">{t('aiTutor.respondIn')}</span>
              <select
                value={respondLang}
                onChange={(e) => setRespondLang(e.target.value as 'en' | 'hi')}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
              >
                <option value="en">{t('aiTutor.english')}</option>
                <option value="hi">{t('aiTutor.hindi')}</option>
              </select>
            </div>
          </div>

          {error && <Card className="border-rose-300 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300">{error}</Card>}

          {/* ---------------- VOICE MODE ---------------- */}
          {mode === 'voice' && (
            <Card className="space-y-4">
              {!canListen ? (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
                  {t('aiTutor.voiceNoMic')}
                </div>
              ) : listenFlaky ? (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-300">
                  {t('aiTutor.voiceIosWarning')}
                </div>
              ) : null}

              <div className="flex flex-col items-center gap-3 py-4">
                <button
                  onClick={voiceState === 'idle' ? startVoice : stopVoice}
                  disabled={!online || !canListen}
                  className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition disabled:opacity-40 ${
                    voiceState === 'idle'
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : voiceState === 'listening'
                        ? 'animate-pulse bg-rose-500'
                        : 'bg-slate-500'
                  }`}
                  aria-label={voiceStatusLabel[voiceState]}
                >
                  {voiceState === 'idle' ? (
                    <Mic size={34} />
                  ) : voiceState === 'thinking' ? (
                    <Loader2 size={34} className="animate-spin" />
                  ) : voiceState === 'speaking' ? (
                    <Volume2 size={34} />
                  ) : (
                    <Square size={30} />
                  )}
                </button>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{voiceStatusLabel[voiceState]}</p>
                {partial && <p className="max-w-md text-center text-sm italic text-slate-400">&ldquo;{partial}&rdquo;</p>}
                {voiceState !== 'idle' && (
                  <button onClick={stopVoice} className="text-xs text-slate-400 underline hover:text-rose-500">
                    {t('aiTutor.voiceStop')}
                  </button>
                )}
              </div>

              {lastAssistant && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="mb-1 text-xs font-medium text-slate-400">{t('aiTutor.voiceLastAnswer')}</p>
                  <div className="text-sm text-slate-700 dark:text-slate-200"><Markdown text={lastAssistant.content} /></div>
                  <button
                    onClick={() => replay(lastAssistant.content)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-teal-600 hover:underline"
                  >
                    <Volume2 size={12} /> {t('aiTutor.voiceReplay')}
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-400">{t('aiTutor.voiceHint')}</p>
            </Card>
          )}

          {/* ---------------- CHAT MODE ---------------- */}
          {mode === 'chat' && (
            <Card className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                {canSpeak ? (
                  <button
                    onClick={() => {
                      primeSpeech()
                      if (autoSpeak) stopSpeaking()
                      setAutoSpeak(!autoSpeak)
                    }}
                    className={`inline-flex items-center gap-1 text-xs ${autoSpeak ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                    title={t('aiTutor.autoSpeakHint') ?? ''}
                  >
                    {autoSpeak ? <Volume2 size={12} /> : <VolumeX size={12} />} {t('aiTutor.autoSpeak')}
                  </button>
                ) : (
                  <span />
                )}
                <button onClick={clearChat} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                  <Trash2 size={12} /> {t('aiTutor.clearChat')}
                </button>
              </div>
              <div className="max-h-96 min-h-[200px] overflow-y-auto space-y-3 pr-1">
                {(messages ?? []).map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'whitespace-pre-wrap bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {m.role === 'assistant' ? <Markdown text={m.content} /> : m.content}
                      {m.role === 'assistant' && canSpeak && (
                        <button
                          onClick={() => replay(m.content)}
                          className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600"
                        >
                          <Volume2 size={11} /> {t('aiTutor.listen')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && <p className="text-xs text-slate-400">{t('aiTutor.thinking')}</p>}
                <div ref={bottomRef} />
              </div>
              {dictating && partial && <p className="mt-2 text-xs italic text-slate-400">&ldquo;{partial}&rdquo;</p>}
              <div className="mt-3 flex gap-2">
                {canListen && (
                  <button
                    onClick={toggleDictation}
                    disabled={!online}
                    className={`rounded-lg p-2.5 disabled:opacity-50 ${
                      dictating ? 'animate-pulse bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={t('aiTutor.dictate') ?? ''}
                  >
                    <Mic size={16} />
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={t('aiTutor.askPlaceholder') ?? ''}
                  disabled={!online}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!online || loading}
                  className="rounded-lg bg-teal-600 p-2.5 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </Card>
          )}

          {/* ---------------- VOICE SETTINGS ---------------- */}
          {(mode === 'voice' || mode === 'chat') && canSpeak && (
            <Card className="space-y-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('aiTutor.voiceSettings')}</p>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {t('aiTutor.voiceSpeed')}
                  <input
                    type="range"
                    min="0.6"
                    max="1.6"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="w-8 tabular-nums text-slate-400">{rate.toFixed(1)}x</span>
                </label>
                {availableVoices.length > 0 ? (
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {t('aiTutor.voiceName')}
                    <select
                      value={voiceURI}
                      onChange={(e) => setVoiceURI(e.target.value)}
                      className="max-w-[12rem] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
                    >
                      <option value="">{t('aiTutor.voiceDefault')}</option>
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {respondLang === 'hi' ? t('aiTutor.noHindiVoice') : t('aiTutor.noVoice')}
                  </span>
                )}
              </div>
            </Card>
          )}

          {mode === 'quiz-me' && (
            <Card className="space-y-3">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('aiTutor.topicPlaceholder') ?? ''}
                disabled={!online}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm disabled:opacity-50"
              />
              <button
                onClick={handleQuizMe}
                disabled={!online || loading}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? t('aiTutor.thinking') : t('aiTutor.generateQuiz')}
              </button>
              {quizResult && (
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200">
                    <Markdown text={quizResult} />
                  </div>
                  {canSpeak && (
                    <button onClick={() => replay(quizResult)} className="inline-flex items-center gap-1 text-xs text-teal-600 hover:underline">
                      <Volume2 size={12} /> {t('aiTutor.listen')}
                    </button>
                  )}
                </div>
              )}
            </Card>
          )}

          {mode === 'evaluate' && (
            <Card className="space-y-3">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder={t('aiTutor.pasteAnswer') ?? ''}
                rows={8}
                disabled={!online}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm disabled:opacity-50"
              />
              <button
                onClick={handleEvaluate}
                disabled={!online || loading}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? t('aiTutor.thinking') : t('aiTutor.evaluateBtn')}
              </button>
              {evalResult && (
                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200">
                    <Markdown text={evalResult} />
                  </div>
                  {canSpeak && (
                    <button onClick={() => replay(evalResult)} className="inline-flex items-center gap-1 text-xs text-teal-600 hover:underline">
                      <Volume2 size={12} /> {t('aiTutor.listen')}
                    </button>
                  )}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
