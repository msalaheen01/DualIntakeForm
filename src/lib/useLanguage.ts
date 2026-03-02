"use client";

import { useCallback, useEffect, useState } from "react";
import type { Language } from "./types";

const STORAGE_KEY = "district_office_lang";

export function useLanguage(): { lang: Language; setLang: (l: Language) => void } {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "bn" || stored === "en") setLangState(stored);
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  return { lang, setLang };
}
