import { createContext, useContext, useEffect, useState } from 'react'
import { translations, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

function getInitialLanguage() {
  const saved = localStorage.getItem('gymup_lang')
  if (saved && translations[saved]) return saved
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLanguage)

  useEffect(() => {
    localStorage.setItem('gymup_lang', lang)
    const meta = LANGUAGES.find((l) => l.code === lang)
    document.documentElement.lang = lang
    document.documentElement.dir = meta?.dir ?? 'ltr'
  }, [lang])

  // Looks up a dot-path like "memberModal.titleAdd" in the current
  // language's dictionary. Two calling styles both work:
  //   t('alert.expired', 3)       -> calls the template directly
  //   t('alert.expired')(3)       -> returns the template, call it yourself
  // If the value found is a function and no extra args were passed here,
  // the function itself is returned instead of being called with nothing.
  function t(path, ...args) {
    const parts = path.split('.')
    let node = translations[lang]
    for (const part of parts) {
      node = node?.[part]
    }
    if (typeof node === 'function') {
      return args.length > 0 ? node(...args) : node
    }
    return node ?? path
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
