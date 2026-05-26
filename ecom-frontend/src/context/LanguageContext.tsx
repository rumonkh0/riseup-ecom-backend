"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { enTranslations } from "../locales/en";
import { bnTranslations } from "../locales/bn";

/* ───────────────────────── Types ───────────────────────── */
export type Language = "en" | "bn";

type TranslationType = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationType;
  formatNumber: (num: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language;
      if (savedLang === "en" || savedLang === "bn") {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language;
        if (browserLang.toLowerCase().includes("bn")) {
          setLanguageState("bn");
        }
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const formatNumber = (num: number | string): string => {
    if (language === "en") return String(num);

    const englishToBengaliDigits: Record<string, string> = {
      "0": "০",
      "1": "১",
      "2": "২",
      "3": "৩",
      "4": "৪",
      "5": "৫",
      "6": "৬",
      "7": "৭",
      "8": "৮",
      "9": "৯",
      ".": "."
    };

    return String(num)
      .split("")
      .map((char) => englishToBengaliDigits[char] || char)
      .join("");
  };

  const t = language === "en" ? enTranslations : bnTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, formatNumber }}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
