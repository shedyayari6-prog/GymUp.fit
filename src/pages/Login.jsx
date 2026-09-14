import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-ink overflow-hidden">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between p-14 lg:p-20 bg-graphite border-r border-steel">
        <div className="font-display text-3xl text-chalk tracking-wide animate-fade-in">
          {t('brand')}
        </div>

        <div className="space-y-6 animate-slide-up">
          <h1 className="font-display text-5xl lg:text-6xl text-chalk leading-[1.1]">
            {t('login.heroTitle1')}
            <br />
            <span className="text-brasslight">{t('login.heroTitle2')}</span>
          </h1>
          <p className="text-chalkdim text-lg leading-relaxed max-w-md">
            {t('login.heroSubtitle')}
          </p>
        </div>

        <div className="text-chalkdim text-base tracking-wide animate-fade-in">
          {t('login.heroFooter')}
        </div>
      </div>

      {/* Right panel / Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 md:p-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-8 animate-slide-up"
        >
          <div className="space-y-2">
            <h2 className="font-display text-4xl text-chalk tracking-tight">
              {t('login.heading')}
            </h2>
            <p className="text-chalkdim text-base leading-relaxed">
              {t('login.subheading')}
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-chalkdim"
              >
                {t('login.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-graphite border border-steel px-4 py-3.5 text-lg text-chalk
                           placeholder:text-chalkdim/50
                           focus:border-brass focus:ring-2 focus:ring-brass/40 outline-none
                           transition-all duration-300"
                placeholder={t('login.emailPlaceholder')}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-chalkdim"
              >
                {t('login.password')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-graphite border border-steel px-4 py-3.5 text-lg text-chalk
                           placeholder:text-chalkdim/50
                           focus:border-brass focus:ring-2 focus:ring-brass/40 outline-none
                           transition-all duration-300"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-rust text-sm bg-rust/10 border border-rust/25 rounded-xl px-4 py-3 animate-shake">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brass hover:bg-brasslight active:scale-[0.98]
                       text-ink font-semibold text-lg py-3.5 rounded-xl
                       transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink
                       hover:shadow-lg hover:shadow-brass/20"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                {t('login.submitBusy')}
              </span>
            ) : (
              t('login.submit')
            )}
          </button>

          {/* Footer link */}
          <p className="text-center text-base text-chalkdim">
            {t('login.noAccount')}{' '}
            <Link
              to="/signup"
              className="text-brasslight hover:text-brass font-medium underline-offset-4 hover:underline transition-colors duration-200"
            >
              {t('login.createAccountLink')}
            </Link>
          </p>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out both;
        }
        .animate-slide-up {
          animation: slide-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}