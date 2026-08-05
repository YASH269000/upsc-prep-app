import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import Card from '../components/Card'
import { useDarkMode, useLanguage } from '../hooks/useSettings'
import { GEMINI_MODELS, getGeminiApiKey, getGeminiModel, setGeminiApiKey, setGeminiModel } from '../lib/llm'
import { downloadFullBackup, importFullBackup } from '../lib/backup'
import { Download, Upload, ExternalLink, Check } from 'lucide-react'

export default function Settings() {
  const { t } = useTranslation()
  const { dark, toggle } = useDarkMode()
  const { language, setLanguage } = useLanguage()
  const [apiKey, setApiKeyState] = useState(getGeminiApiKey())
  const [model, setModelState] = useState(getGeminiModel())
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState('')

  const handleSaveKey = () => {
    setGeminiApiKey(apiKey.trim())
    setGeminiModel(model)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImport = async (file: File) => {
    const text = await file.text()
    try {
      await importFullBackup(text)
      setImportMsg('Import successful. Reloading...')
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setImportMsg('Import failed: invalid file.')
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('settings.title')}</h1>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('settings.language')}</span>
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden text-xs font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 ${language === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 ${language === 'hi' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('settings.darkMode')}</span>
          <button
            onClick={toggle}
            className={`relative h-6 w-11 rounded-full transition-colors ${dark ? 'bg-teal-600' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${dark ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('settings.aiProvider')}</h3>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">{t('settings.geminiKey')}</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyState(e.target.value)}
          placeholder="AIza..."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
        <p className="text-xs text-slate-400">{t('settings.keyStoredLocally')}</p>

        <label className="block pt-1 text-xs font-medium text-slate-600 dark:text-slate-300">{t('settings.model')}</label>
        <select
          value={model}
          onChange={(e) => setModelState(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        >
          {GEMINI_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400">{t('settings.modelHint')}</p>

        <div className="flex items-center gap-3">
          <button onClick={handleSaveKey} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
            {saved ? <span className="flex items-center gap-1"><Check size={14} /> {t('settings.saved')}</span> : 'Save'}
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
          >
            {t('settings.getKey')} <ExternalLink size={12} />
          </a>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('settings.dataManagement')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadFullBackup()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download size={14} /> {t('settings.exportBackup')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Upload size={14} /> {t('settings.importBackup')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
          />
        </div>
        {importMsg && <p className="text-xs text-slate-500 dark:text-slate-400">{importMsg}</p>}
      </Card>

      <Card>
        <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('settings.aboutLegal')}</h3>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('settings.aboutText')}</p>
      </Card>
    </div>
  )
}
