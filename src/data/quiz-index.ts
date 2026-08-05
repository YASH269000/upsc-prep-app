import type { QuizQuestion } from '../db/db'
import { QUIZ_POLITY } from './quiz-polity'
import { QUIZ_HISTORY } from './quiz-history'
import { QUIZ_GEOGRAPHY, QUIZ_ENVIRONMENT } from './quiz-geo-env'
import { QUIZ_ECONOMY, QUIZ_SCITECH } from './quiz-economy-sci'
import { QUIZ_CSAT } from './quiz-csat'

export const QUIZ_SEED: Omit<QuizQuestion, 'id'>[] = [
  ...QUIZ_POLITY,
  ...QUIZ_HISTORY,
  ...QUIZ_GEOGRAPHY,
  ...QUIZ_ENVIRONMENT,
  ...QUIZ_ECONOMY,
  ...QUIZ_SCITECH,
  ...QUIZ_CSAT,
]

export const QUIZ_SUBJECTS = Array.from(new Set(QUIZ_SEED.map((q) => q.subject)))
