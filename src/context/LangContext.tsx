'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { i18n, Lang } from '@/lib/i18n';

type LangContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prwise_lang') as Lang | null;
    if (saved === 'zh' || saved === 'en') setLang(saved);
    setMounted(true);
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('prwise_lang', l);
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  };

  const t = (key: string): string => {
    if (!i18n[key]) return key;
    return i18n[key][lang] || key;
  };

  if (!mounted) {
    return (
      <LangContext.Provider value={{ lang: 'zh', setLang: handleSetLang, t }}>
        {children}
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
