import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DARK_MODE_KEY = 'upsc-dark-mode'
const LANGUAGE_KEY = 'upsc-language'

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY)
    if (saved !== null) return saved === 'true'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(DARK_MODE_KEY, String(dark))
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return { dark, setDark, toggle }
}

export function useLanguage() {
  const { i18n } = useTranslation()

  const setLanguage = useCallback(
    (lang: 'en' | 'hi') => {
      i18n.changeLanguage(lang)
      localStorage.setItem(LANGUAGE_KEY, lang)
      document.documentElement.lang = lang
    },
    [i18n],
  )

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return { language: i18n.language as 'en' | 'hi', setLanguage }
}
