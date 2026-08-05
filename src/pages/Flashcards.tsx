import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { db, type Flashcard } from '../db/db'
import Card from '../components/Card'
import PrintButton from '../components/PrintButton'
import { gradeCard, newCardFsrsFields, Rating } from '../lib/fsrs'
import { downloadCsv, flashcardsToAnkiCsv } from '../lib/backup'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'

export default function Flashcards() {
  const { t } = useTranslation()
  const allCards = useLiveQuery(() => db.flashcards.toArray(), [])
  const [subjectFilter, setSubjectFilter] = useState('')
  const [reviewIdx, setReviewIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [editing, setEditing] = useState<Flashcard | null | 'new'>(null)

  const subjects = useMemo(() => Array.from(new Set((allCards ?? []).map((c) => c.subject))).sort(), [allCards])

  const dueCards = useMemo(() => {
    if (!allCards) return []
    const now = Date.now()
    return allCards.filter((c) => c.due <= now && (!subjectFilter || c.subject === subjectFilter))
  }, [allCards, subjectFilter])

  const currentCard = dueCards[reviewIdx % Math.max(dueCards.length, 1)]

  const handleGrade = async (rating: number) => {
    if (!currentCard) return
    const updates = gradeCard(currentCard, rating as (typeof Rating)[keyof typeof Rating])
    await db.flashcards.update(currentCard.id!, updates)
    setFlipped(false)
    setReviewIdx((i) => i)
  }

  const handleSaveCard = async (data: { subject: string; front: string; back: string }, id?: number) => {
    if (id) {
      await db.flashcards.update(id, data)
    } else {
      await db.flashcards.add({ ...data, createdAt: Date.now(), ...newCardFsrsFields() })
    }
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    await db.flashcards.delete(id)
  }

  const handleExportAnki = () => {
    if (!allCards) return
    const csv = flashcardsToAnkiCsv(allCards)
    downloadCsv(csv, 'upsc-flashcards-anki.csv')
  }

  if (!allCards) return <p className="text-sm text-slate-500">{t('common.loading')}</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('flashcards.title')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing('new')}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
          >
            <Plus size={14} /> {t('flashcards.newCard')}
          </button>
          <button
            onClick={handleExportAnki}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download size={14} /> {t('flashcards.exportAnki')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value)
            setReviewIdx(0)
            setFlipped(false)
          }}
          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200"
        >
          <option value="">{t('flashcards.decks')} (all)</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <PrintButton label={t('flashcards.print') ?? undefined} />
      </div>

      {/* Review queue */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t('flashcards.due')}: {dueCards.length}
        </h3>
        {currentCard ? (
          <div>
            <div
              onClick={() => setFlipped((f) => !f)}
              className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 p-6 text-center"
            >
              <span className="mb-2 text-[10px] uppercase tracking-wide text-teal-600 dark:text-teal-400">
                {currentCard.subject}
              </span>
              <p className="text-base font-medium text-slate-800 dark:text-slate-100">
                {flipped ? currentCard.back : currentCard.front}
              </p>
              {!flipped && (
                <p className="mt-3 text-xs text-slate-400">{t('flashcards.showAnswer')}</p>
              )}
            </div>
            {flipped && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <button onClick={() => handleGrade(Rating.Again)} className="rounded-lg bg-rose-100 dark:bg-rose-900/40 py-2 text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-200">
                  {t('flashcards.again')}
                </button>
                <button onClick={() => handleGrade(Rating.Hard)} className="rounded-lg bg-amber-100 dark:bg-amber-900/40 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-200">
                  {t('flashcards.hard')}
                </button>
                <button onClick={() => handleGrade(Rating.Good)} className="rounded-lg bg-emerald-100 dark:bg-emerald-900/40 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200">
                  {t('flashcards.good')}
                </button>
                <button onClick={() => handleGrade(Rating.Easy)} className="rounded-lg bg-sky-100 dark:bg-sky-900/40 py-2 text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-200">
                  {t('flashcards.easy')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">{t('flashcards.allDone')}</p>
        )}
      </Card>

      {/* All cards list */}
      <Card id="print-root">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('flashcards.decks')}</h3>
        <div className="space-y-2">
          {allCards
            .filter((c) => !subjectFilter || c.subject === subjectFilter)
            .map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400">{c.subject}</p>
                  <p className="text-sm text-slate-800 dark:text-slate-100">{c.front}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.back}</p>
                </div>
                <div className="no-print flex gap-1">
                  <button onClick={() => setEditing(c)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(c.id!)} className="rounded p-1.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {editing && (
        <CardEditor
          card={editing === 'new' ? null : editing}
          onSave={handleSaveCard}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function CardEditor({
  card,
  onSave,
  onClose,
}: {
  card: Flashcard | null
  onSave: (data: { subject: string; front: string; back: string }, id?: number) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [subject, setSubject] = useState(card?.subject ?? '')
  const [front, setFront] = useState(card?.front ?? '')
  const [back, setBack] = useState(card?.back ?? '')

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-5 shadow-lg">
        <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {card ? t('flashcards.editCard') : t('flashcards.addCard')}
        </h3>
        <div className="space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder={t('flashcards.front') ?? ''}
            rows={2}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder={t('flashcards.back') ?? ''}
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            {t('flashcards.cancel')}
          </button>
          <button
            onClick={() => subject && front && back && onSave({ subject, front, back }, card?.id)}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            {t('flashcards.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
