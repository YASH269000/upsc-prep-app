import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { db } from '../db/db'
import Card from '../components/Card'
import { computeCAStreak, isCAChecklistToday, markCAChecklistToday, todayStr } from '../lib/streak'
import { ExternalLink, Info, Search } from 'lucide-react'

const CA_SOURCES = [
  { title: 'PIB English (All Releases)', url: 'https://pib.gov.in/AllReleasem.aspx?MenuId=3&reg=3&lang=1', description: 'Official Government of India press releases across all ministries.' },
  { title: 'PIB Hindi (सभी विज्ञप्तियां)', url: 'https://pib.gov.in/AllReleasem.aspx?MenuId=3&reg=3&lang=2', description: 'हिंदी में सरकारी प्रेस विज्ञप्तियां।' },
  { title: 'PIB RSS Feeds', url: 'https://pib.gov.in/RssMain.aspx?lang=1', description: 'Subscribe to ministry-wise RSS feeds for automatic updates in any RSS reader app.' },
  { title: 'InsightsonIndia Daily Current Affairs', url: 'https://www.insightsonindia.com', description: 'Curated daily current affairs summaries relevant for UPSC.' },
  { title: 'GKToday Current Affairs', url: 'https://www.gktoday.in', description: 'General knowledge and daily current affairs quizzes.' },
  { title: 'AIR NewsOnAir', url: 'https://newsonair.gov.in', description: 'All India Radio news bulletins and discussion programmes.' },
  { title: 'Drishti IAS Current Affairs', url: 'https://www.drishtiias.com', description: 'Daily current affairs articles with UPSC relevance analysis.' },
  { title: 'The Hindu (for reference)', url: 'https://www.thehindu.com', description: 'Widely recommended newspaper for UPSC current affairs (external site).' },
]

const GS_PAPERS = ['GS I - History/Society/Geography', 'GS II - Polity/Governance/IR', 'GS III - Economy/Environment/S&T', 'GS IV - Ethics', 'Prelims Only', 'Essay']

export default function CurrentAffairs() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'sources' | 'log' | 'checklist'>('sources')
  const entries = useLiveQuery(() => db.currentAffairs.orderBy('date').reverse().toArray(), [])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [checkedToday, setCheckedToday] = useState(false)
  const [caStreak, setCaStreak] = useState(0)
  const checklistDays = useLiveQuery(() => db.caChecklist.orderBy('date').reverse().limit(30).toArray(), [])

  useEffect(() => {
    isCAChecklistToday().then(setCheckedToday)
    computeCAStreak().then(setCaStreak)
  }, [])

  const filtered = useMemo(() => {
    if (!entries) return []
    if (!query) return entries
    const q = query.toLowerCase()
    return entries.filter(
      (e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || e.tags.some((tg) => tg.toLowerCase().includes(q)),
    )
  }, [entries, query])

  const handleToggleChecklist = async () => {
    const next = !checkedToday
    await markCAChecklistToday(next)
    setCheckedToday(next)
    setCaStreak(await computeCAStreak())
  }

  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('ca.title')}</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {(['sources', 'log', 'checklist'] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === tb ? 'border-teal-600 text-teal-700 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400'
            }`}
          >
            {t(`ca.${tb}Tab`)}
          </button>
        ))}
      </div>

      <Card className="flex gap-2 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-800 dark:text-amber-300">{t('ca.autoFetchNote')}</p>
      </Card>

      {tab === 'sources' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CA_SOURCES.map((s) => (
            <Card key={s.url} className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{s.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.description}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                {t('resources.visitLink')} <ExternalLink size={12} />
              </a>
            </Card>
          ))}
        </div>
      )}

      {tab === 'log' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ca.search') ?? ''}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
            >
              {t('ca.addEntry')}
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((e) => (
              <Card key={e.id}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{e.title}</h3>
                  <span className="shrink-0 text-xs text-slate-400">{e.date}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{e.content}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-teal-50 dark:bg-teal-950 px-2 py-0.5 text-[10px] text-teal-700 dark:text-teal-400">
                    {e.gsPaper}
                  </span>
                  {e.tags.map((tg) => (
                    <span key={tg} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                      #{tg}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No entries yet.</p>}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-3">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('ca.checklistQuestion')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('ca.streak')}: {caStreak} {t('dashboard.days')}
              </p>
            </div>
            <button
              onClick={handleToggleChecklist}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                checkedToday ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {checkedToday ? t('ca.yes') : t('ca.no')}
            </button>
          </Card>

          <Card>
            <h3 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Last 30 days</h3>
            <div className="flex flex-wrap gap-1">
              {(checklistDays ?? []).map((d) => (
                <div
                  key={d.date}
                  title={d.date}
                  className={`h-5 w-5 rounded ${d.checked ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {showForm && <LogEntryForm onClose={() => setShowForm(false)} />}
    </div>
  )
}

function LogEntryForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const [date, setDate] = useState(todayStr())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [gsPaper, setGsPaper] = useState(GS_PAPERS[0])
  const [tags, setTags] = useState('')

  const handleSave = async () => {
    if (!title || !content) return
    await db.currentAffairs.add({
      date,
      title,
      content,
      gsPaper,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: Date.now(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-5 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{t('ca.addEntry')}</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
            <select
              value={gsPaper}
              onChange={(e) => setGsPaper(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            >
              {GS_PAPERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('ca.content') ?? ''}
            rows={5}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('ca.tags') ?? ''}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={handleSave} className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
            {t('flashcards.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
