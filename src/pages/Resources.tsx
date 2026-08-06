import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db } from '../db/db'
import Card from '../components/Card'
import { ExternalLink, Search } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  video: 'resources.video',
  text: 'resources.text',
  'official-govt': 'resources.officialGovt',
  youtube: 'resources.youtube',
  'top-channels': 'resources.topChannels',
  documentaries: 'resources.documentaries',
  'mock-interviews': 'resources.mockInterviews',
  'pyq-strategy': 'resources.pyqStrategy',
  'podcast-audio': 'resources.podcastAudio',
  'podcast-video': 'resources.podcastVideo',
}

const TYPE_COLORS: Record<string, string> = {
  video: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  text: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'official-govt': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  youtube: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'top-channels': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  documentaries: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'mock-interviews': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'pyq-strategy': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'podcast-audio': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'podcast-video': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
}

export default function Resources() {
  const { t } = useTranslation()
  const resources = useLiveQuery(() => db.resources.toArray(), [])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [paperFilter, setPaperFilter] = useState('')

  const subjects = useMemo(() => Array.from(new Set((resources ?? []).map((r) => r.subject))).sort(), [resources])
  const papers = useMemo(() => Array.from(new Set((resources ?? []).map((r) => r.paper))).sort(), [resources])

  const filtered = useMemo(() => {
    if (!resources) return []
    return resources.filter((r) => {
      if (typeFilter && r.type !== typeFilter) return false
      if (subjectFilter && r.subject !== subjectFilter) return false
      if (paperFilter && r.paper !== paperFilter) return false
      if (query) {
        const q = query.toLowerCase()
        if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [resources, query, typeFilter, subjectFilter, paperFilter])

  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('resources.title')}</h1>

      <Card className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('resources.search') ?? ''}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="">{t('resources.allTypes')}</option>
            {Object.keys(TYPE_LABELS).map((tp) => (
              <option key={tp} value={tp}>
                {t(TYPE_LABELS[tp])}
              </option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="">{t('resources.allSubjects')}</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="">{t('resources.allPapers')}</option>
            {papers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <p className="text-xs text-slate-500 dark:text-slate-400">{filtered.length} resources</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((r) => (
          <Card key={r.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.title}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[r.type]}`}>
                {t(TYPE_LABELS[r.type])}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{r.description}</p>
            <div className="mt-auto flex items-center justify-between pt-1">
              <div className="flex gap-1 text-[10px] text-slate-400">
                <span>{r.subject}</span>
                <span>·</span>
                <span>{r.paper}</span>
                <span>·</span>
                <span>{r.language}</span>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                {t('resources.visitLink')} <ExternalLink size={12} />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">{t('resources.noResults')}</p>}
    </div>
  )
}
