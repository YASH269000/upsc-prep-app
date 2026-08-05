import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Syllabus from './pages/Syllabus'
import Resources from './pages/Resources'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import CurrentAffairs from './pages/CurrentAffairs'
import AITutor from './pages/AITutor'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import { ensureSeeded } from './db/seed'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ensureSeeded().finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading UPSC Prep…</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/current-affairs" element={<CurrentAffairs />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
