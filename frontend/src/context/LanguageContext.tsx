import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { en } from '../data/locales/en';
import { hi } from '../data/locales/hi';

type Language = 'English' | 'Hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ngo_language');
    return (saved === 'English' || saved === 'Hindi') ? saved : 'English';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ngo_language', lang);
    document.documentElement.lang = lang === 'English' ? 'en' : 'hi';
  };

  useEffect(() => {
    document.documentElement.lang = language === 'English' ? 'en' : 'hi';
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    
    // Choose the dictionary based on language
    const dict = language === 'English' ? en : hi;
    
    let current: any = dict;
    for (const k of keys) {
      if (current === undefined || current === null) break;
      current = current[k];
    }
    
    if (typeof current === 'string') return current;
    
    // Fallback to English if Hindi is missing
    if (language === 'Hindi') {
      let fallback: any = en;
      for (const k of keys) {
        if (fallback === undefined || fallback === null) return key;
        fallback = fallback[k];
      }
      if (typeof fallback === 'string') return fallback;
    }
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
