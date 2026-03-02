"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/useLanguage";
import { LABELS, CATEGORY_LABELS, URGENCY_LABELS } from "@/lib/i18n";
import type { CaseRecord, CaseStatus, IssueCategory } from "@/lib/types";
import { loadCases, upsertCase } from "@/lib/caseStore";

const STATUSES: CaseStatus[] = ["Pending", "Escalated", "Resolved"];

const ISSUE_CATEGORIES: IssueCategory[] = [
  "Housing",
  "NYCHA",
  "Sanitation",
  "Public Benefits",
  "Immigration",
  "Education",
  "Other",
];

function daysSince(dateIso: string): number {
  const d = new Date(dateIso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export default function DashboardPage() {
  const { lang, setLang } = useLanguage();
  const t = LABELS[lang];
  const catLabels = CATEGORY_LABELS[lang];
  const urgencyLabels = URGENCY_LABELS[lang];

  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState<IssueCategory | "All">("All");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setCases(loadCases());
  }, []);

  const filtered = cases.filter((c) => {
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (filterCategory !== "All" && c.issueCategory !== filterCategory) return false;
    return true;
  });

  const pendingCount = cases.filter((c) => c.status === "Pending").length;
  const totalDays = cases.reduce((sum, c) => sum + daysSince(c.dateSubmitted), 0);
  const avgDaysOpen = cases.length ? Math.round(totalDays / cases.length) : 0;

  const categoryCounts: Record<IssueCategory, number> = {
    Housing: 0,
    NYCHA: 0,
    Sanitation: 0,
    "Public Benefits": 0,
    Immigration: 0,
    Education: 0,
    Other: 0,
  };
  cases.forEach((c) => {
    categoryCounts[c.issueCategory]++;
  });
  const sortedCategories = (Object.entries(categoryCounts) as [IssueCategory, number][])
    .sort((a, b) => b[1] - a[1]);
  const mostCommon =
    sortedCategories.length && sortedCategories[0][1] > 0
      ? catLabels[sortedCategories[0][0]]
      : "—";

  function handleStatusChange(record: CaseRecord, newStatus: CaseStatus) {
    const updated = { ...record, status: newStatus };
    upsertCase(updated);
    setCases(loadCases());
  }

  function handleAgencyChange(record: CaseRecord, agency: string) {
    const updated = { ...record, agency };
    upsertCase(updated);
    setCases(loadCases());
  }

  function handleAddNote(record: CaseRecord) {
    const note = (noteInputs[record.caseId] ?? "").trim();
    if (!note) return;
    const updated: CaseRecord = {
      ...record,
      followUpNotes: [
        ...record.followUpNotes,
        { date: new Date().toISOString(), note },
      ],
    };
    upsertCase(updated);
    setNoteInputs((prev) => ({ ...prev, [record.caseId]: "" }));
    setCases(loadCases());
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
        <span>{t.languageToggle}:</span>
        <button
          type="button"
          onClick={() => setLang("en")}
          style={{ padding: "4px 10px", fontWeight: lang === "en" ? "bold" : "normal" }}
        >
          {t.english}
        </button>
        <button
          type="button"
          onClick={() => setLang("bn")}
          style={{ padding: "4px 10px", fontWeight: lang === "bn" ? "bold" : "normal" }}
        >
          {t.bangla}
        </button>
      </div>

      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t.dashboardTitle}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ padding: "1rem", background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
          <div style={{ fontSize: "0.875rem", color: "#718096" }}>{t.totalCases}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{cases.length}</div>
        </div>
        <div style={{ padding: "1rem", background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
          <div style={{ fontSize: "0.875rem", color: "#718096" }}>{t.pendingCases}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{pendingCount}</div>
        </div>
        <div style={{ padding: "1rem", background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
          <div style={{ fontSize: "0.875rem", color: "#718096" }}>{t.avgDaysOpen}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{avgDaysOpen}</div>
        </div>
        <div style={{ padding: "1rem", background: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
          <div style={{ fontSize: "0.875rem", color: "#718096" }}>{t.mostCommonCategory}</div>
          <div style={{ fontSize: "1rem", fontWeight: "bold" }}>{mostCommon}</div>
        </div>
      </div>

      <section style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{t.trends}</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {sortedCategories.map(([cat, count]) => (
            <li
              key={cat}
              style={{
                padding: "4px 10px",
                background: "#edf2f7",
                borderRadius: 4,
                fontSize: "0.875rem",
              }}
            >
              {catLabels[cat]}: {count}
            </li>
          ))}
        </ul>
      </section>

      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold" }}>{t.filters}</span>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {t.filterStatus}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CaseStatus | "All")}
            style={{ padding: "4px 8px" }}
          >
            <option value="All">{t.all}</option>
            <option value="Pending">{t.pending}</option>
            <option value="Escalated">{t.escalated}</option>
            <option value="Resolved">{t.resolved}</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {t.filterCategory}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as IssueCategory | "All")}
            style={{ padding: "4px 8px" }}
          >
            <option value="All">{t.all}</option>
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {catLabels[cat]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#edf2f7", textAlign: "left" }}>
              <th style={thStyle}>{t.caseId}</th>
              <th style={thStyle}>{t.fullName}</th>
              <th style={thStyle}>{t.filterCategory}</th>
              <th style={thStyle}>{t.status}</th>
              <th style={thStyle}>{t.daysSince}</th>
              <th style={thStyle}>{t.urgencyShort}</th>
              <th style={thStyle}>{t.dateSubmitted}</th>
              <th style={thStyle}>{t.agency}</th>
              <th style={thStyle}>{t.notes}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec) => (
              <tr key={rec.caseId} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={tdStyle}>{rec.caseId}</td>
                <td style={tdStyle}>{rec.fullName}</td>
                <td style={tdStyle}>{catLabels[rec.issueCategory]}</td>
                <td style={tdStyle}>
                  <select
                    value={rec.status}
                    onChange={(e) => handleStatusChange(rec, e.target.value as CaseStatus)}
                    style={{ padding: "2px 6px", minWidth: 100 }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s === "Pending" ? t.pending : s === "Escalated" ? t.escalated : t.resolved}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={tdStyle}>{daysSince(rec.dateSubmitted)}</td>
                <td style={tdStyle}>{urgencyLabels[rec.urgency]}</td>
                <td style={tdStyle}>
                  {new Date(rec.dateSubmitted).toLocaleDateString()}
                </td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={rec.agency}
                    onChange={(e) => handleAgencyChange(rec, e.target.value)}
                    placeholder="—"
                    style={{ width: "100%", minWidth: 80, padding: "2px 6px" }}
                  />
                </td>
                <td style={tdStyle}>
                  <div style={{ minWidth: 160 }}>
                    {rec.followUpNotes.slice(-2).map((n, i) => (
                      <div key={i} style={{ fontSize: "0.8rem", marginBottom: 2 }}>
                        {new Date(n.date).toLocaleDateString()}: {n.note}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                      <input
                        type="text"
                        value={noteInputs[rec.caseId] ?? ""}
                        onChange={(e) =>
                          setNoteInputs((prev) => ({ ...prev, [rec.caseId]: e.target.value }))
                        }
                        placeholder={t.addNote}
                        style={{ flex: 1, padding: "2px 6px", minWidth: 0 }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddNote(rec)}
                        style={{ padding: "2px 8px", whiteSpace: "nowrap" }}
                      >
                        {t.addNote}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#718096", marginTop: "1rem" }}>
          {cases.length === 0 ? "No cases yet." : "No cases match the current filters."}
        </p>
      )}

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/intake" style={{ marginRight: "1rem", color: "#3182ce" }}>
          {t.goToIntake}
        </Link>
        <Link href="/" style={{ color: "#3182ce" }}>
          {t.home}
        </Link>
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 10px",
  fontWeight: "bold",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  verticalAlign: "top",
};
