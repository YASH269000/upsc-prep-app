import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db/db'
import Card from '../components/Card'
import { callLLM, hasApiKey, isOnline, LLMError } from '../lib/llm'
import { Send, WifiOff, Trash2 } from 'lucide-react'

type Mode = 'chat' | 'quiz-me' | 'evaluate'

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

  const langName = (l: string) => (l === 'hi' ? 'Hindi' : 'English')

  const handleSendChat = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setError('')
    await db.chatMessages.add({ role: 'user', content: userMsg, timestamp: Date.now(), mode: 'chat' })
    setLoading(true)
    try {
      const prompt = `You are a helpful, knowledgeable UPSC (Indian Civil Services) exam tutor. Answer the following question clearly and concisely, in ${langName(respondLang)}. If relevant, mention which GS paper this topic relates to.\n\nQuestion: ${userMsg}`
      const reply = await callLLM(prompt)
      await db.chatMessages.add({ role: 'assistant', content: reply, timestamp: Date.now(), mode: 'chat' })
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
      const prompt = `Generate a short 5-question multiple choice quiz for UPSC exam preparation on the topic "${topic}". Respond in ${langName(respondLang)}. For each question, give 4 options labeled A-D, indicate the correct answer, and a one-line explanation. Format clearly with numbering.`
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
      const prompt = `You are a UPSC Mains examiner. Evaluate the following answer written by a student. Score it out of 10 on three dimensions: Structure (intro-body-conclusion, use of headings/points), Relevance (does it address the question directly), and Clarity (language, coherence). Give a total score out of 10, and specific actionable feedback for improvement. Respond in ${langName(respondLang)}.\n\nStudent's Answer:\n${answerText}`
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
            <div className="flex gap-2">
              {(['chat', 'quiz-me', 'evaluate'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    mode === m ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m === 'chat' ? t('aiTutor.chat') : m === 'quiz-me' ? t('aiTutor.quizMe') : t('aiTutor.evaluate')}
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

          {mode === 'chat' && (
            <Card className="flex flex-col">
              <div className="mb-2 flex justify-end">
                <button onClick={clearChat} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                  <Trash2 size={12} /> {t('aiTutor.clearChat')}
                </button>
              </div>
              <div className="max-h-96 min-h-[200px] overflow-y-auto space-y-3 pr-1">
                {(messages ?? []).map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && <p className="text-xs text-slate-400">{t('aiTutor.thinking')}</p>}
                <div ref={bottomRef} />
              </div>
              <div className="mt-3 flex gap-2">
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
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200">
                  {quizResult}
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
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-700 dark:text-slate-200">
                  {evalResult}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
