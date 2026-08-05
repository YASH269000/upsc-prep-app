import { Printer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function PrintButton({ label }: { label?: string }) {
  const { t } = useTranslation()
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Printer size={15} />
      {label || t('common.print')}
    </button>
  )
}
