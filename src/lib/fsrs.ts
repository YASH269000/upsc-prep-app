import { createEmptyCard, FSRS, generatorParameters, Rating, State, type Card, type RecordLog } from 'ts-fsrs'
import type { Flashcard } from '../db/db'

const params = generatorParameters({ enable_fuzz: true })
const fsrs = new FSRS(params)

export { Rating }

function toCard(fc: Flashcard): Card {
  return {
    due: new Date(fc.due),
    stability: fc.stability,
    difficulty: fc.difficulty,
    elapsed_days: fc.elapsed_days,
    scheduled_days: fc.scheduled_days,
    reps: fc.reps,
    lapses: fc.lapses,
    state: fc.state as State,
    last_review: fc.last_review ? new Date(fc.last_review) : undefined,
    learning_steps: fc.learning_steps ?? 0,
  }
}

export function newCardFsrsFields(): Pick<Flashcard, 'due' | 'stability' | 'difficulty' | 'elapsed_days' | 'scheduled_days' | 'learning_steps' | 'reps' | 'lapses' | 'state' | 'last_review'> {
  const card = createEmptyCard(new Date())
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as number,
    last_review: null,
  }
}

/**
 * Given a flashcard and a user rating (Again/Hard/Good/Easy), returns the
 * updated FSRS scheduling fields to persist.
 */
export function gradeCard(fc: Flashcard, rating: (typeof Rating)[keyof typeof Rating]) {
  const card = toCard(fc)
  const now = new Date()
  const schedulingCards: RecordLog = fsrs.repeat(card, now)
  const result = schedulingCards[rating as keyof RecordLog]
  const updated = result.card
  return {
    due: updated.due.getTime(),
    stability: updated.stability,
    difficulty: updated.difficulty,
    elapsed_days: updated.elapsed_days,
    scheduled_days: updated.scheduled_days,
    learning_steps: updated.learning_steps,
    reps: updated.reps,
    lapses: updated.lapses,
    state: updated.state as number,
    last_review: now.getTime(),
  }
}

export function isDue(fc: Flashcard): boolean {
  return fc.due <= Date.now()
}
