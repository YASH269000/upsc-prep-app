import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

/**
 * Keep the installed app up to date.
 *
 * The service worker is registered automatically by vite-plugin-pwa, and is
 * built with skipWaiting + clientsClaim. But a page that is ALREADY open keeps
 * running the old JavaScript it loaded with, so a new deployment would only
 * appear after the user happened to reload twice. That is confusing, and on an
 * installed PWA it can look like updates never arrive at all.
 *
 * So: when a new service worker takes control, reload once automatically. We
 * skip the reload on very first install (nothing to replace), and guard against
 * reload loops.
 */
if ('serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller)
  let reloading = false

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return
    reloading = true
    window.location.reload()
  })

  navigator.serviceWorker.ready
    .then((registration) => {
      // Check on launch, when the tab regains focus, and hourly while open.
      const check = () => registration.update().catch(() => undefined)
      check()
      window.addEventListener('focus', check)
      setInterval(check, 60 * 60 * 1000)
    })
    .catch(() => undefined)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
