'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useLang } from '@/context/LangContext';

const links = [
  { key: 'nav_features', href: '/#features' },
  { key: 'nav_testimonials', href: '/#testimonials' },
  { key: 'nav_interactive', href: '/demo' },
  { key: 'nav_pricing', href: '/pricing' },
  { key: 'nav_faq', href: '/#faq' },
];

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950">P</div>
          <span className="font-semibold text-lg">PRwise</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className="hover:text-white transition">
              {t(l.key)}
            </Link>
          ))}
          <span className="w-px h-4 bg-slate-700" />
          <button
            className="text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-white transition flex items-center gap-1.5"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-slate-500 hover:text-white transition"
              >
                Sign Out
              </button>
              <img
                src={session.user.image ?? ''}
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
            </div>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-medium text-sm px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-brand-500/25 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t('nav_install')}
            </button>
          )}
          <button
            className="md:hidden text-slate-300 p-2 hover:text-white transition text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/50 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              {t(l.key)}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {session?.user ? (
              <>
                <Link href="/dashboard" className="block text-sm text-slate-400 hover:text-white py-2" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className="block text-sm text-slate-400 hover:text-white py-2 w-full text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); signIn('github'); }}
                className="inline-flex items-center gap-2 bg-brand-500 text-slate-950 font-medium text-sm px-4 py-2 rounded-lg w-full justify-center cursor-pointer"
              >
                {t('nav_install')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
