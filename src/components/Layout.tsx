import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDarkMode, useLanguage } from '../hooks/useSettings'
import {
  LayoutDashboard,
  ListChecks,
  Library,
  Brain,
  Layers,
  Newspaper,
  Bot,
  NotebookPen,
  Settings as SettingsIcon,
  Sun,
  Moon,
} from 'lucide-react'

const navItems = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/syllabus', key: 'syllabus', icon: ListChecks },
  { to: '/resources', key: 'resources', icon: Library },
  { to: '/quiz', key: 'quiz', icon: Brain },
  { to: '/flashcards', key: 'flashcards', icon: Layers },
  { to: '/current-affairs', key: 'currentAffairs', icon: Newspaper },
  { to: '/ai-tutor', key: 'aiTutor', icon: Bot },
  { to: '/notes', key: 'notes', icon: NotebookPen },
  { to: '/settings', key: 'settings', icon: SettingsIcon },
]

export default function Layout() {
  const { t } = useTranslation()
  const { dark, toggle } = useDarkMode()
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex h-full min-h-screen flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="no-print hidden md:flex md:w-64 md:flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-lg font-semibold text-teal-700 dark:text-teal-400">{t('appName')}</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map(({ to, key, icon: Icon, end }) => (
            <NavLink
              key={key}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 border-r-2 border-teal-600'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-3 md:px-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 md:hidden">{t('appName')}</h2>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 ${language === 'en' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 ${language === 'hi' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                हिं
              </button>
            </div>
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="no-print fixed bottom-0 left-0 right-0 z-20 flex md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
        {navItems.map(({ to, key, icon: Icon, end }) => (
          <NavLink
            key={key}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 min-w-[64px] flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <Icon size={18} />
            <span className="truncate max-w-[60px]">{t(`nav.${key}`)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
