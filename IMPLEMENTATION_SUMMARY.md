# Implementation Summary: Bilingual Constituent Intake & Case Tracking

## Overview

A simple civic technology prototype for a NYC Council district office: a **Bilingual (English / Bangla)** constituent intake form and case tracking dashboard. No authentication, no backend database—data is stored in the browser via **localStorage** only. Built with **Next.js (App Router)** and **TypeScript**.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Inline styles and minimal global CSS (no UI library)
- **Persistence:** localStorage only (helper functions in `src/lib/caseStore.ts`)
- **No:** Auth, backend DB, Prisma, or external UI libraries

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata
│   ├── page.tsx            # Home: links to Intake and Dashboard
│   ├── globals.css         # Minimal global styles
│   ├── intake/
│   │   └── page.tsx        # Bilingual intake form (client)
│   └── dashboard/
│       └── page.tsx        # Case table, filters, metrics (client)
└── lib/
    ├── types.ts            # CaseRecord, CaseStatus, Language, IssueCategory, Urgency
    ├── i18n.ts             # English + Bangla labels, category/urgency mappings
    ├── caseStore.ts        # loadCases, saveCases, upsertCase, createCaseId
    └── useLanguage.ts      # Client hook: lang + setLang, persisted to localStorage
```

---

## 1. Intake Form (`/intake`)

- **Language toggle:** English | বাংলা — all UI labels and dropdown options switch language.
- **Required fields:**
  - Full Name  
  - Phone Number  
  - Email  
  - Preferred Language (English / Bangla)  
  - Address (Bronx only): validated so it must include the word “Bronx” **or** a ZIP code starting with **104**; otherwise a validation message is shown in the selected language.  
  - Issue Category: Housing, NYCHA, Sanitation, Public Benefits, Immigration, Education, Other  
  - Description of Issue (textarea)  
  - Urgency Level: Low / Medium / High  

- **On submit:**
  - A new **Case ID** is generated in the form `BX-YYYYMMDD-NNNN` (e.g. `BX-20250301-0001`), incrementing per day based on existing cases.
  - **Status** is set to **Pending**.
  - **Date Submitted** is set to current time (ISO string).
  - **Agency** is left blank.
  - **Follow-up notes** are an empty array.
  - The record is saved to localStorage via `upsertCase`.

- **After submit:** The page shows “Case created: &lt;caseId&gt;” (or Bangla equivalent) and a link to the Dashboard.

---

## 2. Dashboard (`/dashboard`)

- **Data source:** All cases are loaded from localStorage on mount.
- **Filters:**
  - **Status:** All, Pending, Escalated, Resolved  
  - **Issue Category:** All plus each of the seven categories  

- **Summary metrics (top of page):**
  - **Total Cases** — count of all cases.  
  - **Pending Cases** — count where status = Pending.  
  - **Average Days Open** — average of “days since date submitted” across all cases.  
  - **Most Common Issue Category** — category with the highest count.  

- **Table columns (in order):**  
  Case ID, Name, Category, Status, Days Since Submitted, Urgency, Date Submitted, Agency, Follow-up Notes.

- **Editable fields (persisted to localStorage):**
  - **Status** — dropdown (Pending / Escalated / Resolved); change updates the stored case.  
  - **Agency** — text input; change updates the stored case.  
  - **Follow-up Notes** — “Add note” input + button per row; new note is appended with current date (ISO); the last **2** notes are shown per case.  

- **Trends section:** Counts by issue category, sorted descending (most common first).

- **Language toggle:** Same English / Bangla behavior as the intake form for all dashboard labels.

---

## 3. Types (`src/lib/types.ts`)

- **CaseStatus:** `"Pending" | "Escalated" | "Resolved"`  
- **Language:** `"en" | "bn"`  
- **IssueCategory:** Union of Housing, NYCHA, Sanitation, Public Benefits, Immigration, Education, Other  
- **Urgency:** `"Low" | "Medium" | "High"`  
- **CaseRecord:** Object with `caseId`, `fullName`, `phone`, `email`, `preferredLanguage`, `address`, `issueCategory`, `description`, `urgency`, `status`, `dateSubmitted` (ISO string), `agency`, `followUpNotes` (array of `{ date: string; note: string }`).

---

## 4. Internationalization (`src/lib/i18n.ts`)

- **LABELS:** Object keyed by `en` and `bn` with all UI strings (app title, intake/dashboard titles, form labels, buttons, filters, metrics, validation message, etc.).
- **CATEGORY_LABELS:** Maps each `IssueCategory` to its label in English and Bangla.
- **URGENCY_LABELS:** Maps each `Urgency` to its label in English and Bangla.
- Bangla copy uses formal, civic-appropriate language (no slang).

---

## 5. Case Storage (`src/lib/caseStore.ts`)

- **Storage key:** `district_office_cases` (constant).
- **loadCases():** Returns array of `CaseRecord` from localStorage; returns `[]` if missing or invalid.
- **saveCases(cases):** Writes the array to localStorage.
- **upsertCase(record):** If a case with the same `caseId` exists, it is updated; otherwise the record is appended; then `saveCases` is called.
- **createCaseId(existingCases):** Builds `BX-YYYYMMDD-NNNN` using today’s date and the next sequence number for that day (by scanning existing case IDs).

---

## 6. Language Hook (`src/lib/useLanguage.ts`)

- Client-only hook.
- Storage key: `district_office_lang`.
- Returns `{ lang, setLang }` where `lang` is `"en"` or `"bn"` and `setLang` updates state and localStorage so the preference persists across visits.

---

## 7. Home Page (`/`)

- Simple page with the app title and short description.
- Two links: **New Intake** → `/intake`, **Case Dashboard** → `/dashboard`.

---

## 8. Out of Scope (Not Implemented)

- No user authentication or login.
- No server-side or external database (no Prisma, no API routes for DB).
- No server-side persistence; everything is client-side localStorage only.

---

## How to Run

- `npm install`  
- `npm run dev`  
- Open http://localhost:3000 (home), http://localhost:3000/intake (form), http://localhost:3000/dashboard (cases).

Data is stored only in the browser; clearing site data or using a different browser/device will show no cases.
