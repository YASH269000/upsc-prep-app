import { db } from '../db/db'

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function markStudiedToday() {
  await db.studyStreak.put({ date: todayStr(), studied: true })
}

export async function isStudiedToday(): Promise<boolean> {
  const rec = await db.studyStreak.get(todayStr())
  return !!rec?.studied
}

/** Computes current consecutive-day streak ending today or yesterday. */
export async function computeStreak(): Promise<number> {
  const all = (await db.studyStreak.toArray()).filter((r) => r.studied)
  const dates = new Set(all.map((r) => r.date))
  let streak = 0
  const d = new Date()
  // If not studied today, streak counts back from yesterday (still "alive")
  if (!dates.has(todayStr())) {
    d.setDate(d.getDate() - 1)
  }
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

export async function markCAChecklistToday(checked: boolean) {
  await db.caChecklist.put({ date: todayStr(), checked })
}

export async function isCAChecklistToday(): Promise<boolean> {
  const rec = await db.caChecklist.get(todayStr())
  return !!rec?.checked
}

export async function computeCAStreak(): Promise<number> {
  const all = (await db.caChecklist.toArray()).filter((r) => r.checked)
  const dates = new Set(all.map((r) => r.date))
  let streak = 0
  const d = new Date()
  if (!dates.has(todayStr())) {
    d.setDate(d.getDate() - 1)
  }
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}
