import { db } from './db'
import { seedTopics } from '../data/syllabus'
import { RESOURCES_SEED, RESOURCES_VERSION } from '../data/resources'
import { QUIZ_SEED } from '../data/quiz-index'
import { FLASHCARDS_SEED } from '../data/flashcards'
import { newCardFsrsFields } from '../lib/fsrs'

const SEED_FLAG_KEY = 'seeded-v1'

export async function ensureSeeded() {
  const flag = await db.settings.get(SEED_FLAG_KEY)
  if (flag?.value === 'true') return

  await db.transaction('rw', db.syllabusTopics, db.resources, db.quizQuestions, db.flashcards, db.settings, async () => {
    const topicCount = await db.syllabusTopics.count()
    if (topicCount === 0) {
      await db.syllabusTopics.bulkAdd(seedTopics())
    }

    const resourceCount = await db.resources.count()
    if (resourceCount === 0) {
      await db.resources.bulkAdd(RESOURCES_SEED)
    }

    const quizCount = await db.quizQuestions.count()
    if (quizCount === 0) {
      await db.quizQuestions.bulkAdd(QUIZ_SEED)
    }

    const flashcardCount = await db.flashcards.count()
    if (flashcardCount === 0) {
      const now = Date.now()
      const cards = FLASHCARDS_SEED.map((f) => ({
        subject: f.subject,
        front: f.front,
        back: f.back,
        createdAt: now,
        ...newCardFsrsFields(),
      }))
      await db.flashcards.bulkAdd(cards)
    }

    await db.settings.put({ key: SEED_FLAG_KEY, value: 'true' })
  })

  // Versioned resource seeding: whenever RESOURCES_VERSION changes, replace the
  // local copy of the directory. Resources are seed-only data (users cannot add
  // their own), so clearing and re-seeding is always safe and keeps existing
  // installs in sync with link fixes and new entries.
  const stored = await db.settings.get('resources-version')
  if (stored?.value !== String(RESOURCES_VERSION)) {
    await db.transaction('rw', db.resources, db.settings, async () => {
      await db.resources.clear()
      await db.resources.bulkAdd(RESOURCES_SEED)
      await db.settings.put({ key: 'resources-version', value: String(RESOURCES_VERSION) })
    })
  }
}
