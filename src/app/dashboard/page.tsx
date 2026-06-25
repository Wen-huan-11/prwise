'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LangContext';

interface Stats {
  users: number;
  repositories: number;
  reviews: number;
  findings: number;
}

export default function DashboardPage() {
  const { t } = useLang();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="pt-32 pb-24 px-4 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: stats?.users ?? '-', color: 'text-brand-400' },
    { label: 'Repositories', value: stats?.repositories ?? '-', color: 'text-white' },
    { label: 'Reviews Run', value: stats?.reviews ?? '-', color: 'text-white' },
    { label: 'Findings', value: stats?.findings ?? '-', color: 'text-brand-400' },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            &larr; Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statCards.map((s) => (
            <div key={s.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-3">API Endpoints</h2>
          <div className="space-y-2 text-sm text-left max-w-md mx-auto">
            <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
              <code className="text-slate-300 font-mono text-xs">/api/stats</code>
              <span className="text-slate-500 text-xs ml-auto">Platform stats</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
              <code className="text-slate-300 font-mono text-xs">/api/auth/register</code>
              <span className="text-slate-500 text-xs ml-auto">User registration</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
              <code className="text-slate-300 font-mono text-xs">/api/repositories</code>
              <span className="text-slate-500 text-xs ml-auto">List repos</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
              <code className="text-slate-300 font-mono text-xs">/api/repositories</code>
              <span className="text-slate-500 text-xs ml-auto">Add repo</span>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono">GET</span>
              <code className="text-slate-300 font-mono text-xs">/api/reviews</code>
              <span className="text-slate-500 text-xs ml-auto">List reviews</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">POST</span>
              <code className="text-slate-300 font-mono text-xs">/api/reviews</code>
              <span className="text-slate-500 text-xs ml-auto">Create review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
