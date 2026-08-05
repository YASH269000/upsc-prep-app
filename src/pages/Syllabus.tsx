import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db } from '../db/db'
import type { SyllabusTopic, ResourceLink } from '../db/db'
import ProgressRing from '../components/ProgressRing'
import Card from '../components/Card'
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'

function subjectForSection(section: string): string {
  if (section.includes('Polity') || section.toLowerCase().includes('governance')) return 'Polity'
  if (section.includes('History')) return 'History'
  if (section.includes('Geography')) return 'Geography'
  if (section.includes('Economy') || section.includes('Economic')) return 'Economy'
  if (section.includes('Environment')) return 'Environment'
  if (section.includes('Science')) return 'Science & Tech'
  if (section.includes('CSAT')) return 'CSAT'
  if (section.includes('Ethics')) return 'Ethics'
  return 'General'
}

function TopicNode({
  topic,
  allTopics,
  resources,
  depth,
  onToggle,
}: {
  topic: SyllabusTopic
  allTopics: SyllabusTopic[]
  resources: ResourceLink[]
  depth: number
  onToggle: (id: string, next: boolean) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(depth < 1)
  const kids = allTopics.filter((x) => x.parent === topic.id)
  const isLeaf = kids.length === 0

  const relatedResources = isLeaf
    ? resources.filter((r) => r.subject === subjectForSection(topic.section) || r.paper === topic.section).slice(0, 4)
    : []

  return (
    <div className={depth > 0 ? 'ml-4 border-l border-slate-200 dark:border-slate-800 pl-3' : ''}>
      <div className="flex items-start gap-2 py-1.5">
        {kids.length > 0 ? (
          <button onClick={() => setOpen((o) => !o)} className="mt-0.5 text-slate-400">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <label className="flex flex-1 cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={topic.studied}
            onChange={(e) => onToggle(topic.id, e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className={`text-sm ${topic.studied ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'} ${kids.length === 0 ? '' : 'font-medium'}`}>
            {topic.title}
          </span>
        </label>
      </div>
      {topic.studied && topic.studiedAt && (
        <p className="ml-6 text-[11px] text-slate-400">
          {t('syllabus.studiedOn')} {new Date(topic.studiedAt).toLocaleDateString()}
        </p>
      )}
      {isLeaf && relatedResources.length > 0 && (
        <div className="ml-6 mb-2 flex flex-wrap gap-1.5">
          {relatedResources.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-400"
              title={r.description}
            >
              {r.title.length > 28 ? r.title.slice(0, 28) + '…' : r.title}
              <ExternalLink size={9} />
            </a>
          ))}
        </div>
      )}
      {open &&
        kids.map((k) => (
          <TopicNode
            key={k.id}
            topic={k}
            allTopics={allTopics}
            resources={resources}
            depth={depth + 1}
            onToggle={onToggle}
          />
        ))}
    </div>
  )
}

export default function Syllabus() {
  const { t } = useTranslation()
  const topics = useLiveQuery(() => db.syllabusTopics.toArray(), [])
  const resources = useLiveQuery(() => db.resources.toArray(), [])

  const handleToggle = async (id: string, next: boolean) => {
    await db.syllabusTopics.update(id, { studied: next, studiedAt: next ? Date.now() : null })
  }

  const sections = useMemo(() => {
    if (!topics) return []
    const roots = topics.filter((tp) => tp.parent === null).sort((a, b) => a.order - b.order)
    return roots
  }, [topics])

  const overallPct = useMemo(() => {
    if (!topics || topics.length === 0) return 0
    return (topics.filter((tp) => tp.studied).length / topics.length) * 100
  }, [topics])

  if (!topics || !resources) return <p className="text-sm text-slate-500">{t('common.loading')}</p>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('syllabus.title')}</h1>
      </div>

      <Card className="flex items-center gap-4">
        <ProgressRing percent={overallPct} size={80} strokeWidth={7} />
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('syllabus.overallProgress')}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {topics.filter((tp) => tp.studied).length} / {topics.length}
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        {sections.map((section) => {
          const sectionTopics = topics.filter((tp) => tp.section === section.section)
          const sectionPct = sectionTopics.length
            ? (sectionTopics.filter((tp) => tp.studied).length / sectionTopics.length) * 100
            : 0
          return (
            <Card key={section.id}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{section.section}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(sectionPct)}%</span>
              </div>
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${sectionPct}%` }} />
              </div>
              <TopicNode
                topic={section}
                allTopics={topics}
                resources={resources}
                depth={0}
                onToggle={handleToggle}
              />
            </Card>
          )
        })}
      </div>
    </div>
  )
}
