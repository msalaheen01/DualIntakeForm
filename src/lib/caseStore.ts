import type { CaseRecord } from "./types";

const STORAGE_KEY = "district_office_cases";

export function loadCases(): CaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCases(cases: CaseRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch {
    // ignore
  }
}

export function upsertCase(record: CaseRecord): void {
  const cases = loadCases();
  const idx = cases.findIndex((c) => c.caseId === record.caseId);
  if (idx >= 0) {
    cases[idx] = record;
  } else {
    cases.push(record);
  }
  saveCases(cases);
}

/**
 * Returns a case ID in format BX-YYYYMMDD-NNNN (e.g. BX-20250301-0001), incrementing per day.
 */
export function createCaseId(existingCases: CaseRecord[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayPrefix = `BX-${y}${mo}${day}-`;
  let maxSeq = 0;
  for (const c of existingCases) {
    if (c.caseId.startsWith(todayPrefix)) {
      const rest = c.caseId.slice(todayPrefix.length);
      const n = parseInt(rest, 10);
      if (!Number.isNaN(n) && n > maxSeq) maxSeq = n;
    }
  }
  const seq = String(maxSeq + 1).padStart(4, "0");
  return `${todayPrefix}${seq}`;
}
