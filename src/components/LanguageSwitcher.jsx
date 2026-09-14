import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang, languages, t } = useLanguage()

  return (
    <div className="mt-3">
      <label className="block text-chalkdim/70 text-xs mb-1">{t('sidebar.language')}</label>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="w-full text-sm rounded-md bg-ink border border-steel px-2 py-1.5 text-chalk focus:border-brass outline-none"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
