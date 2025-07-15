// LanguageContext.tsx
import { createContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "uk";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const defaultLanguage: Language = "en";

export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("appLanguage");
    if (saved === "en" || saved === "uk") {
      return saved;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "uk" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
