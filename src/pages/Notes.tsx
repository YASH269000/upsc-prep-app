import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { db, type Note } from '../db/db'
import Card from '../components/Card'
import PrintButton from '../components/PrintButton'
import { Plus, Trash2, Search } from 'lucide-react'

export default function Notes() {
  const { t } = useTranslation()
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray(), [])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)

  const filtered = useMemo(() => {
    if (!notes) return []
    if (!query) return notes
    const q = query.toLowerCase()
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((tg) => tg.toLowerCase().includes(q)),
    )
  }, [notes, query])

  const selected = notes?.find((n) => n.id === selectedId) ?? null

  const handleNew = async () => {
    const id = await db.notes.add({
      title: 'Untitled Note',
      content: '',
      subject: 'General',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    setSelectedId(id)
    setEditMode(true)
  }

  const handleDelete = async (id: number) => {
    await db.notes.delete(id)
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
      <div className="md:col-span-1 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('notes.title')}</h1>
          <button onClick={handleNew} className="rounded-lg bg-teal-600 p-2 text-white hover:bg-teal-700">
            <Plus size={16} />
          </button>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('notes.search') ?? ''}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setSelectedId(n.id!)
                setEditMode(false)
              }}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                selectedId === n.id
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300'
              }`}
            >
              <p className="truncate font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
              <p className="truncate text-xs text-slate-400">{n.subject}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">{t('notes.noNotes')}</p>}
        </div>
      </div>

      <div className="md:col-span-2">
        {selected ? (
          <NoteEditor
            note={selected}
            editMode={editMode}
            setEditMode={setEditMode}
            onDelete={() => handleDelete(selected.id!)}
          />
        ) : (
          <Card className="flex h-64 items-center justify-center text-sm text-slate-400">Select or create a note.</Card>
        )}
      </div>
    </div>
  )
}

function NoteEditor({
  note,
  editMode,
  setEditMode,
  onDelete,
}: {
  note: Note
  editMode: boolean
  setEditMode: (v: boolean) => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [subject, setSubject] = useState(note.subject)
  const [tags, setTags] = useState(note.tags.join(', '))

  const handleSave = async () => {
    await db.notes.update(note.id!, {
      title,
      content,
      subject,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      updatedAt: Date.now(),
    })
    setEditMode(false)
  }

  if (editMode) {
    return (
      <Card className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('notes.noteTitle') ?? ''}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium"
        />
        <div className="flex gap-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('notes.subject') ?? ''}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('notes.tags') ?? ''}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('notes.content') ?? ''}
          rows={14}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 font-mono text-sm"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditMode(false)} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={handleSave} className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
            {t('notes.save')}
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card id="print-root">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{note.title}</h2>
          <p className="text-xs text-slate-400">
            {note.subject} {note.tags.length > 0 && `· ${note.tags.map((t) => `#${t}`).join(' ')}`}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <PrintButton label={t('notes.print') ?? undefined} />
          <button onClick={() => setEditMode(true)} className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            Edit
          </button>
          <button onClick={onDelete} className="rounded-lg border border-rose-200 dark:border-rose-900 p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold">
        <ReactMarkdown>{note.content || '*No content yet. Click Edit to add.*'}</ReactMarkdown>
      </div>
    </Card>
  )
}
