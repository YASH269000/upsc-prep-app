import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { db, type QuizQuestion, type QuizAttempt } from '../db/db'
import { QUIZ_SUBJECTS } from '../data/quiz-index'
import Card from '../components/Card'
import PrintButton from '../components/PrintButton'
import { Clock } from 'lucide-react'

type Screen = 'setup' | 'active' | 'results'

interface AnswerRecord {
  questionId: number
  selectedIndex: number | null
  timeSec: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const { t } = useTranslation()
  const [screen, setScreen] = useState<Screen>('setup')
  const [mode, setMode] = useState<'practice' | 'mock'>('practice')
  const [subject, setSubject] = useState<string>('mixed')
  const [numQuestions, setNumQuestions] = useState(10)
  const [timeLimitMin, setTimeLimitMin] = useState(15)

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [questionStart, setQuestionStart] = useState(Date.now())
  const [quizStart, setQuizStart] = useState(Date.now())
  const [timeLeft, setTimeLeft] = useState(0)
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)

  const attempts = useLiveQuery(() => db.quizAttempts.orderBy('timestamp').reverse().limit(10).toArray(), [])

  const finishQuizRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (mode !== 'mock' || screen !== 'active') return
    if (timeLeft <= 0) {
      finishQuizRef.current()
      return
    }
    const iv = setInterval(() => {
      setTimeLeft((tl) => Math.max(0, tl - 1))
    }, 1000)
    return () => clearInterval(iv)
  }, [mode, screen, timeLeft])

  const startQuiz = async () => {
    let pool = await db.quizQuestions.toArray()
    if (subject !== 'mixed') pool = pool.filter((q) => q.subject === subject)
    const selectedQs = shuffle(pool).slice(0, numQuestions)
    setActiveQuestions(selectedQs)
    setCurrent(0)
    setSelected(null)
    setShowFeedback(false)
    setAnswers([])
    setQuestionStart(Date.now())
    setQuizStart(Date.now())
    setTimeLeft(timeLimitMin * 60)
    setScreen('active')
  }

  const currentQ = activeQuestions[current]

  const commitAnswer = (idx: number | null) => {
    const timeSec = Math.round((Date.now() - questionStart) / 1000)
    const nextAnswers = [...answers, { questionId: currentQ.id!, selectedIndex: idx, timeSec }]
    setAnswers(nextAnswers)
    if (mode === 'practice') {
      setSelected(idx)
      setShowFeedback(true)
    } else {
      goNext(nextAnswers)
    }
  }

  const goNext = (answersSoFar: AnswerRecord[] = answers) => {
    if (current + 1 >= activeQuestions.length) {
      finishQuiz(answersSoFar)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowFeedback(false)
      setQuestionStart(Date.now())
    }
  }

  const finishQuiz = async (answersSoFar: AnswerRecord[] = answers) => {
    const totalTimeSec = Math.round((Date.now() - quizStart) / 1000)
    const results = activeQuestions.map((q) => {
      const a = answersSoFar.find((x) => x.questionId === q.id)
      return {
        questionId: q.id!,
        selectedIndex: a?.selectedIndex ?? null,
        correct: a?.selectedIndex === q.correctIndex,
        timeSec: a?.timeSec ?? 0,
      }
    })
    const correct = results.filter((r) => r.correct).length
    const skipped = results.filter((r) => r.selectedIndex === null).length
    const incorrect = results.length - correct - skipped

    const attempt: Omit<QuizAttempt, 'id'> = {
      timestamp: Date.now(),
      mode,
      subject,
      totalQuestions: activeQuestions.length,
      correct,
      incorrect,
      skipped,
      timeTakenSec: totalTimeSec,
      questionResults: results,
    }
    const id = await db.quizAttempts.add(attempt)
    setLastAttempt({ ...attempt, id })
    setScreen('results')
  }

  useEffect(() => {
    finishQuizRef.current = () => finishQuiz()
  })

  const mm = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  const resultDetails = useMemo(() => {
    if (!lastAttempt) return []
    return lastAttempt.questionResults.map((r) => {
      const q = activeQuestions.find((qq) => qq.id === r.questionId)
      return { ...r, q }
    })
  }, [lastAttempt, activeQuestions])

  if (screen === 'setup') {
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('quiz.title')}</h1>

        <Card className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('practice')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${mode === 'practice' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {t('quiz.practiceMode')}
            </button>
            <button
              onClick={() => setMode('mock')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${mode === 'mock' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              {t('quiz.mockMode')}
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{t('quiz.subject')}</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
            >
              <option value="mixed">{t('quiz.mixed')}</option>
              {QUIZ_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{t('quiz.numQuestions')}</label>
            <input
              type="number"
              min={5}
              max={50}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
            />
          </div>

          {mode === 'mock' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Time limit (minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={timeLimitMin}
                onChange={(e) => setTimeLimitMin(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          <button onClick={startQuiz} className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            {t('quiz.startQuiz')}
          </button>
        </Card>

        {attempts && attempts.length > 0 && (
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('quiz.history')}</h3>
            <div className="space-y-2">
              {attempts.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>{new Date(a.timestamp).toLocaleString()}</span>
                  <span>{a.subject}</span>
                  <span className="font-medium">{a.correct}/{a.totalQuestions}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (screen === 'active' && currentQ) {
    return (
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {current + 1} / {activeQuestions.length}
          </span>
          {mode === 'mock' && (
            <span className="flex items-center gap-1 text-sm font-medium text-rose-600 dark:text-rose-400">
              <Clock size={14} /> {mm(timeLeft)}
            </span>
          )}
        </div>

        <Card>
          <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">{currentQ.question}</p>
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              let cls = 'border-slate-200 dark:border-slate-700 hover:border-teal-400'
              if (showFeedback) {
                if (idx === currentQ.correctIndex) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                else if (idx === selected) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950'
              } else if (idx === selected) {
                cls = 'border-teal-500 bg-teal-50 dark:bg-teal-950'
              }
              return (
                <button
                  key={idx}
                  disabled={showFeedback}
                  onClick={() => (mode === 'practice' ? setSelected(idx) : commitAnswer(idx))}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 ${cls}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('quiz.explanation')}:</p>
              <p className="mt-1">{currentQ.explanation}</p>
              <p className="mt-1 italic text-slate-400">Source: {currentQ.source}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            {mode === 'practice' && !showFeedback && (
              <button
                onClick={() => commitAnswer(selected)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {t('quiz.submit')}
              </button>
            )}
            {mode === 'practice' && showFeedback && (
              <button
                onClick={() => goNext()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {current + 1 >= activeQuestions.length ? t('quiz.finish') : t('quiz.next')}
              </button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  if (screen === 'results' && lastAttempt) {
    const accuracy = lastAttempt.totalQuestions ? Math.round((lastAttempt.correct / lastAttempt.totalQuestions) * 100) : 0
    return (
      <div id="print-root" className="max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('quiz.results')}</h1>
          <PrintButton label={t('quiz.print') ?? undefined} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {lastAttempt.correct}/{lastAttempt.totalQuestions}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('quiz.score')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{accuracy}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('quiz.accuracy')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{mm(lastAttempt.timeTakenSec)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('quiz.timeTaken')}</p>
          </Card>
        </div>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('quiz.reviewAnswers')}</h3>
          <div className="space-y-4">
            {resultDetails.map((r, i) => (
              <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {i + 1}. {r.q?.question}
                </p>
                <p className={`mt-1 text-xs ${r.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t('quiz.yourAnswer')}: {r.selectedIndex !== null ? r.q?.options[r.selectedIndex] : '—'}
                </p>
                {!r.correct && (
                  <p className="text-xs text-emerald-600">
                    {t('quiz.correctAnswer')}: {r.q?.options[r.q.correctIndex]}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{r.q?.explanation}</p>
              </div>
            ))}
          </div>
        </Card>

        <button
          onClick={() => setScreen('setup')}
          className="no-print w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          {t('quiz.startQuiz')}
        </button>
      </div>
    )
  }

  return null
}
