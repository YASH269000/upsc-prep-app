import Dexie, { type Table } from 'dexie'

// ---------- Types ----------

export interface SyllabusTopic {
  id: string // stable slug e.g. "prelims.polity.constitution-basics"
  section: string // e.g. "Prelims GS I", "Mains GS II", "Optional - Sociology"
  parent: string | null // parent topic id, null for top-level
  title: string
  titleHi?: string
  order: number
  studied: boolean
  studiedAt: number | null // epoch ms
}

export interface ResourceLink {
  id?: number
  title: string
  description: string
  url: string
  type: 'video' | 'text' | 'official-govt' | 'youtube' | 'top-channels' | 'documentaries' | 'mock-interviews' | 'pyq-strategy' | 'podcast-audio' | 'podcast-video'
  subject: string // e.g. Polity, History, Geography, Economy, Environment, Science & Tech, CSAT, Ethics, Essay, Current Affairs
  paper: string // e.g. "Prelims GS I", "Mains GS II", "CSAT", "All Papers"
  language: 'English' | 'Hindi' | 'English/Hindi'
}

export interface QuizQuestion {
  id?: number
  subject: string
  paper: string
  question: string
  options: [string, string, string, string]
  correctIndex: number // 0-3
  explanation: string
  source: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizAttempt {
  id?: number
  timestamp: number
  mode: 'practice' | 'mock'
  subject: string | 'mixed'
  totalQuestions: number
  correct: number
  incorrect: number
  skipped: number
  timeTakenSec: number
  questionResults: {
    questionId: number
    selectedIndex: number | null
    correct: boolean
    timeSec: number
  }[]
}

export interface Flashcard {
  id?: number
  subject: string
  front: string
  back: string
  createdAt: number
  // FSRS fields
  due: number // epoch ms
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number // FSRS State enum value
  last_review: number | null
}

export interface Note {
  id?: number
  title: string
  content: string // markdown
  subject: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface CurrentAffairsEntry {
  id?: number
  date: string // YYYY-MM-DD
  title: string
  content: string
  gsPaper: string // e.g. "GS II - Polity", "GS III - Economy"
  tags: string[]
  createdAt: number
}

export interface CAChecklistDay {
  date: string // YYYY-MM-DD, primary key
  checked: boolean
}

export interface StudyStreak {
  date: string // YYYY-MM-DD primary key
  studied: boolean
}

export interface Settings {
  key: string // primary key, e.g. "language", "darkMode", "geminiApiKey"
  value: string
}

export interface ChatMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  mode: 'chat' | 'quiz-me' | 'evaluate'
}

// ---------- Dexie DB ----------

class UpscDB extends Dexie {
  syllabusTopics!: Table<SyllabusTopic, string>
  resources!: Table<ResourceLink, number>
  quizQuestions!: Table<QuizQuestion, number>
  quizAttempts!: Table<QuizAttempt, number>
  flashcards!: Table<Flashcard, number>
  notes!: Table<Note, number>
  currentAffairs!: Table<CurrentAffairsEntry, number>
  caChecklist!: Table<CAChecklistDay, string>
  studyStreak!: Table<StudyStreak, string>
  settings!: Table<Settings, string>
  chatMessages!: Table<ChatMessage, number>

  constructor() {
    super('upsc-prep-db')
    this.version(1).stores({
      syllabusTopics: 'id, section, parent, studied',
      resources: '++id, subject, paper, type, language',
      quizQuestions: '++id, subject, paper, difficulty',
      quizAttempts: '++id, timestamp, subject, mode',
      flashcards: '++id, subject, due, state',
      notes: '++id, subject, updatedAt, *tags',
      currentAffairs: '++id, date, gsPaper, *tags',
      caChecklist: 'date',
      studyStreak: 'date',
      settings: 'key',
      chatMessages: '++id, timestamp, mode',
    })
  }
}

export const db = new UpscDB()
