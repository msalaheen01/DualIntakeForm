"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/useLanguage";
import { LABELS, CATEGORY_LABELS, URGENCY_LABELS } from "@/lib/i18n";
import type { CaseRecord, IssueCategory, Language, Urgency } from "@/lib/types";
import { loadCases, upsertCase, createCaseId } from "@/lib/caseStore";

const ISSUE_CATEGORIES: IssueCategory[] = [
  "Housing",
  "NYCHA",
  "Sanitation",
  "Public Benefits",
  "Immigration",
  "Education",
  "Other",
];

const URGENCIES: Urgency[] = ["Low", "Medium", "High"];

function validateBronx(address: string): boolean {
  const trimmed = address.trim();
  if (!trimmed) return false;
  if (/bronx/i.test(trimmed)) return true;
  const zipMatch = trimmed.match(/\b104\d{2}\b/);
  return !!zipMatch;
}

export default function IntakePage() {
  const { lang, setLang } = useLanguage();
  const t = LABELS[lang];
  const catLabels = CATEGORY_LABELS[lang];
  const urgencyLabels = URGENCY_LABELS[lang];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("en");
  const [address, setAddress] = useState("");
  const [issueCategory, setIssueCategory] = useState<IssueCategory>("Other");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("Medium");
  const [bronxError, setBronxError] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBronxError("");
    if (!validateBronx(address)) {
      setBronxError(t.validationBronx);
      return;
    }
    const cases = loadCases();
    const caseId = createCaseId(cases);
    const dateSubmitted = new Date().toISOString();
    const record: CaseRecord = {
      caseId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      preferredLanguage,
      address: address.trim(),
      issueCategory,
      description: description.trim(),
      urgency,
      status: "Pending",
      dateSubmitted,
      agency: "",
      followUpNotes: [],
      assignedTo: "",
      lastUpdated: dateSubmitted,
      dateResolved: undefined,
    };
    upsertCase(record);
    setCreatedId(caseId);
  }

  if (createdId) {
    return (
      <div style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => setLang("en")}
            style={{
              marginRight: 8,
              padding: "4px 8px",
              fontWeight: lang === "en" ? "bold" : "normal",
            }}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("bn")}
            style={{
              padding: "4px 8px",
              fontWeight: lang === "bn" ? "bold" : "normal",
            }}
          >
            বাংলা
          </button>
        </div>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          {t.caseCreated}: <strong>{createdId}</strong>
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#1a365d",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          {t.viewDashboard}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ marginRight: 8 }}>{t.languageToggle}:</span>
        <button
          type="button"
          onClick={() => setLang("en")}
          style={{
            padding: "4px 10px",
            fontWeight: lang === "en" ? "bold" : "normal",
          }}
        >
          {t.english}
        </button>
        <button
          type="button"
          onClick={() => setLang("bn")}
          style={{
            padding: "4px 10px",
            fontWeight: lang === "bn" ? "bold" : "normal",
          }}
        >
          {t.bangla}
        </button>
      </div>

      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{t.intakeTitle}</h1>

      <form onSubmit={handleSubmit}>
        <fieldset style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <legend style={{ fontWeight: "bold" }}>{t.sectionConstituent}</legend>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="fullName" style={{ display: "block", marginBottom: 4 }}>
              {t.fullName} *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="phone" style={{ display: "block", marginBottom: 4 }}>
              {t.phone} *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: 4 }}>
              {t.email} *
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="preferredLanguage" style={{ display: "block", marginBottom: 4 }}>
              {t.preferredLanguage} *
            </label>
            <select
              id="preferredLanguage"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Language)}
              style={{ padding: "6px 8px" }}
            >
              <option value="en">{t.english}</option>
              <option value="bn">{t.bangla}</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="address" style={{ display: "block", marginBottom: 4 }}>
              {t.addressBronx} *
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setBronxError("");
              }}
              style={{ width: "100%", padding: "6px 8px" }}
            />
            {bronxError && (
              <p style={{ color: "#c53030", fontSize: "0.875rem", marginTop: 4 }}>{bronxError}</p>
            )}
          </div>
        </fieldset>

        <fieldset style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <legend style={{ fontWeight: "bold" }}>{t.sectionCase}</legend>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="issueCategory" style={{ display: "block", marginBottom: 4 }}>
              {t.issueCategory} *
            </label>
            <select
              id="issueCategory"
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
              style={{ padding: "6px 8px", minWidth: 200 }}
            >
              {ISSUE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {catLabels[cat]}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="description" style={{ display: "block", marginBottom: 4 }}>
              {t.description} *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "6px 8px" }}
            />
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="urgency" style={{ display: "block", marginBottom: 4 }}>
              {t.urgency} *
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as Urgency)}
              style={{ padding: "6px 8px" }}
            >
              {URGENCIES.map((u) => (
                <option key={u} value={u}>
                  {urgencyLabels[u]}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1.25rem",
            background: "#1a365d",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {t.submit}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/" style={{ color: "#3182ce" }}>
          {t.home}
        </Link>
      </p>
    </div>
  );
}
