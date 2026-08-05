import { db } from './db'
import { seedTopics } from '../data/syllabus'
import { RESOURCES_SEED } from '../data/resources'
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

  // v2 migration: resource directory expansion (Aug 2026). Resources are
  // seed-only data (users cannot add their own), so clearing and re-seeding
  // is safe and brings existing installs up to date.
  const v2 = await db.settings.get('seeded-v2-resources')
  if (v2?.value !== 'true') {
    await db.transaction('rw', db.resources, db.settings, async () => {
      await db.resources.clear()
      await db.resources.bulkAdd(RESOURCES_SEED)
      await db.settings.put({ key: 'seeded-v2-resources', value: 'true' })
    })
  }
}
