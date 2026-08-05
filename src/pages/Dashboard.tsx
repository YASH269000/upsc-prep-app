import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db/db'
import Card from '../components/Card'
import ProgressRing from '../components/ProgressRing'
import { computeStreak, isStudiedToday, markStudiedToday, todayStr } from '../lib/streak'
import { useEffect, useState } from 'react'
import { Flame, BookOpenCheck, Layers, Newspaper } from 'lucide-react'

export default function Dashboard() {
  const { t } = useTranslation()
  const [streak, setStreak] = useState(0)
  const [studiedToday, setStudiedTodayState] = useState(false)

  const topics = useLiveQuery(() => db.syllabusTopics.toArray(), [])
  const dueCards = useLiveQuery(() => db.flashcards.where('due').belowOrEqual(Date.now()).count(), [])
  const lastQuiz = useLiveQuery(() => db.quizAttempts.orderBy('timestamp').last(), [])
  const lastNote = useLiveQuery(() => db.notes.orderBy('updatedAt').last(), [])
  const latestCA = useLiveQuery(() => db.currentAffairs.orderBy('date').last(), [])

  useEffect(() => {
    computeStreak().then(setStreak)
    isStudiedToday().then(setStudiedTodayState)
  }, [])

  const totalTopics = topics?.length ?? 0
  const studiedTopics = topics?.filter((tp) => tp.studied).length ?? 0
  const overallPct = totalTopics ? (studiedTopics / totalTopics) * 100 : 0

  const handleMarkStudied = async () => {
    await markStudiedToday()
    setStudiedTodayState(true)
    setStreak(await computeStreak())
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('dashboard.title')}</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{todayStr()}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/40 p-2.5 text-orange-600 dark:text-orange-400">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{streak}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.streak')} ({t('dashboard.days')})</p>
            </div>
          </div>
          {!studiedToday && (
            <button
              onClick={handleMarkStudied}
              className="mt-3 w-full rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
            >
              {t('dashboard.markStudiedToday')}
            </button>
          )}
          {studiedToday && <p className="mt-3 text-xs font-medium text-teal-600 dark:text-teal-400">{t('dashboard.studiedToday')}</p>}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-100 dark:bg-sky-900/40 p-2.5 text-sky-600 dark:text-sky-400">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{dueCards ?? 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.dueToday')}</p>
            </div>
          </div>
          <Link to="/flashcards" className="mt-3 inline-block text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
            {t('dashboard.resume')} →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-violet-100 dark:bg-violet-900/40 p-2.5 text-violet-600 dark:text-violet-400">
              <BookOpenCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {lastQuiz ? `${lastQuiz.correct}/${lastQuiz.totalQuestions}` : '—'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lastQuiz ? t('dashboard.resumeQuiz') : t('dashboard.noRecentQuiz')}
              </p>
            </div>
          </div>
          <Link to="/quiz" className="mt-3 inline-block text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
            {t('dashboard.resume')} →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-rose-100 dark:bg-rose-900/40 p-2.5 text-rose-600 dark:text-rose-400">
              <Newspaper size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {latestCA ? latestCA.title : t('dashboard.noCA')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{latestCA ? latestCA.date : t('dashboard.latestCA')}</p>
            </div>
          </div>
          <Link to="/current-affairs" className="mt-3 inline-block text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
            {t('dashboard.resume')} →
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center gap-2 py-6">
          <ProgressRing percent={overallPct} size={120} label={t('dashboard.syllabusProgress')} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {studiedTopics} / {totalTopics} {t('nav.syllabus')}
          </p>
          <Link to="/syllabus" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
            {t('nav.syllabus')} →
          </Link>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('dashboard.resumeNotes')}</h3>
          {lastNote ? (
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{lastNote.title}</p>
              <p className="mt-1 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{lastNote.content}</p>
              <Link to="/notes" className="mt-2 inline-block text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
                {t('dashboard.resume')} →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.noRecentNotes')}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
