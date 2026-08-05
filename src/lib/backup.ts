import { db } from '../db/db'

export async function exportFullBackup(): Promise<string> {
  const data: Record<string, unknown> = {}
  for (const table of db.tables) {
    data[table.name] = await table.toArray()
  }
  return JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, data }, null, 2)
}

export async function downloadFullBackup() {
  const json = await exportFullBackup()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `upsc-prep-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function importFullBackup(json: string): Promise<void> {
  const parsed = JSON.parse(json)
  const data = parsed.data ?? parsed // support raw dump too
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) {
      const rows = data[table.name]
      if (Array.isArray(rows)) {
        await table.clear()
        await table.bulkAdd(rows)
      }
    }
  })
}

export function flashcardsToAnkiCsv(cards: { front: string; back: string }[]): string {
  const escape = (s: string) => `"${s.replace(/"/g, '""').replace(/\n/g, '<br>')}"`
  const lines = cards.map((c) => `${escape(c.front)},${escape(c.back)}`)
  return lines.join('\n')
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
