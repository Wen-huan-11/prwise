'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Stats {
  users: number;
  repositories: number;
  reviews: number;
  findings: number;
}

interface Repository {
  id: string;
  fullName: string;
  name: string;
  owner: string;
  private: boolean;
  active: boolean;
  createdAt: string;
  _count: { reviews: number };
}

interface FindingItem {
  id: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  filePath: string | null;
  lineStart: number | null;
  suggestion: string | null;
}

interface ReviewItem {
  id: string;
  prNumber: number;
  prTitle: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  qualityScore: number | null;
  findingsCount: number | null;
  summary: string | null;
  createdAt: string;
  completedAt: string | null;
  repository: { fullName: string };
  findings: FindingItem[];
}

const severityBadge: Record<string, string> = {
  ERROR: 'bg-red-500/20 text-red-400',
  WARNING: 'bg-yellow-500/20 text-yellow-400',
  INFO: 'bg-blue-500/20 text-blue-400',
};

const statusBadge: Record<string, string> = {
  PENDING: 'bg-slate-700 text-slate-400',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
  FAILED: 'bg-red-500/20 text-red-400',
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);

  const [prUrl, setPrUrl] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewItem | null>(null);
  const [reviewError, setReviewError] = useState('');

  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const [errors, setErrors] = useState<{ stats?: string; reviews?: string; repos?: string }>({});

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;

    const load = async () => {
      const errs: typeof errors = {};

      const [statsRes, reviewsRes, reposRes] = await Promise.allSettled([
        fetch('/api/stats'),
        fetch('/api/reviews'),
        fetch('/api/repositories'),
      ]);

      if (cancelled) return;

      if (statsRes.status === 'fulfilled') {
        const data = await statsRes.value.json();
        setStats(data.error ? null : data);
        if (data.error) errs.stats = data.error;
      } else {
        errs.stats = '统计数据加载失败';
      }

      if (reviewsRes.status === 'fulfilled') {
        const data = await reviewsRes.value.json();
        setReviews(Array.isArray(data) ? data : []);
        if (!Array.isArray(data)) errs.reviews = data.error || '审查历史加载失败';
      } else {
        errs.reviews = '审查历史加载失败';
      }

      if (reposRes.status === 'fulfilled') {
        const data = await reposRes.value.json();
        setRepos(Array.isArray(data) ? data : []);
        if (!Array.isArray(data)) errs.repos = data.error || '仓库列表加载失败';
      } else {
        errs.repos = '仓库列表加载失败';
      }

      setErrors(errs);
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [status, reviewResult]);

  const startReview = async () => {
    if (!prUrl.trim()) return;
    setReviewing(true);
    setReviewError('');
    setReviewResult(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl, lang: 'zh' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setReviewResult(data);
      setPrUrl('');
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : '审查失败');
    } finally {
      setReviewing(false);
    }
  };

  const deleteRepo = async (id: string) => {
    if (!confirm('确定要删除这个仓库吗？相关的审查记录也会被删除。')) return;
    try {
      const res = await fetch(`/api/repositories?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      setRepos((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('删除失败，请重试');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedReview((prev) => (prev === id ? null : id));
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="pt-32 pb-24 px-4 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  const statCards = [
    { label: '总用户', value: stats?.users ?? '-', color: 'text-brand-400' },
    { label: '仓库数', value: stats?.repositories ?? '-', color: 'text-white' },
    { label: '审查次数', value: stats?.reviews ?? '-', color: 'text-white' },
    { label: '发现问题', value: stats?.findings ?? '-', color: 'text-brand-400' },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              欢迎回来，{session?.user?.name}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            &larr; 返回首页
          </Link>
        </div>

        {/* Error banners */}
        {Object.entries(errors).map(([key, msg]) =>
          msg ? (
            <div key={key} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300">
              {msg}
            </div>
          ) : null
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-center"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two columns: PR URL review + Repositories */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* PR URL Review */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">审查 PR</h2>
            <p className="text-sm text-slate-500">
              输入 GitHub PR 链接，AI 将自动分析代码变更。
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/pull/123"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50"
              />
              <button
                onClick={startReview}
                disabled={reviewing || !prUrl.trim()}
                className="bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm whitespace-nowrap"
              >
                {reviewing ? '审查中...' : '开始审查'}
              </button>
            </div>

            {reviewError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300">
                {reviewError}
              </div>
            )}

            {reviewResult && (
              <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-300">
                    审查完成
                  </span>
                  <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded">
                    {reviewResult.qualityScore ?? '-'}/100
                  </span>
                </div>
                <p className="text-sm text-slate-400">{reviewResult.summary}</p>
                <p className="text-xs text-slate-500">
                  发现问题：{reviewResult.findingsCount ?? 0} 个
                </p>
              </div>
            )}
          </div>

          {/* Repository List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">我的仓库</h2>
              <span className="text-xs text-slate-500">{repos.length} 个</span>
            </div>

            {repos.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                暂无仓库。提交一个 PR URL 审查后会自动添加。
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">
                        {repo.fullName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {repo._count.reviews} 次审查
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRepo(repo.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition shrink-0 ml-2"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review History */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">审查历史</h2>
            <span className="text-xs text-slate-500">
              共 {reviews.length} 条
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">加载中...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              暂无审查记录。在左侧输入 PR URL 开始你的第一次审查。
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-950/30 hover:bg-slate-950/50 transition text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${statusBadge[review.status]}`}
                      >
                        {review.status === 'COMPLETED'
                          ? '已完成'
                          : review.status === 'FAILED'
                          ? '失败'
                          : review.status === 'IN_PROGRESS'
                          ? '进行中'
                          : '等待中'}
                      </span>
                      <span className="text-sm text-slate-300 truncate">
                        {review.repository.fullName} #{review.prNumber}
                      </span>
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        {review.prTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      {review.qualityScore !== null && (
                        <span className="text-xs text-brand-400 font-medium">
                          {review.qualityScore} 分
                        </span>
                      )}
                      <span className="text-xs text-slate-600">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {expandedReview === review.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {expandedReview === review.id && (
                    <div className="p-4 border-t border-slate-800 space-y-3">
                      {review.findings.length === 0 ? (
                        <p className="text-sm text-slate-500">未发现问题</p>
                      ) : (
                        review.findings.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/30"
                          >
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5 ${severityBadge[f.severity]}`}
                            >
                              {f.severity === 'ERROR'
                                ? '错误'
                                : f.severity === 'WARNING'
                                ? '警告'
                                : '提示'}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-300">
                                {f.title}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {f.description}
                              </div>
                              {f.filePath && (
                                <div className="text-xs text-slate-600 mt-1 font-mono">
                                  {f.filePath}
                                  {f.lineStart ? `:${f.lineStart}` : ''}
                                </div>
                              )}
                              {f.suggestion && (
                                <div className="text-xs text-slate-400 mt-1">
                                  💡 {f.suggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
