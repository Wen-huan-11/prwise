'use client';

import { useLang } from '@/context/LangContext';

export default function PrivacyPage() {
  const { t } = useLang();

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">{t('privacy_title')}</h1>
          <p className="text-slate-400">{t('privacy_desc')}</p>
          <p className="text-xs text-slate-600">Last updated: June 2026</p>
        </div>
        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. 信息收集</h2>
            <p>我们仅收集运行 PR Review 服务所必需的信息：仓库元数据（名称、可见性）、PR Diff 内容、代码文件路径和文件名。我们不会存储完整的源代码文件。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. 信息使用</h2>
            <p>收集的信息仅用于：执行 AI 代码审查、生成审查结果报告、改进审查准确率（不包含你的代码）。你的代码不会被用于训练 LLM 模型。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. 数据传输与存储</h2>
            <p>所有数据通过 TLS 1.3 加密传输。PR Diff 内容在审查完成后 24 小时内从服务器删除。审查结果（不含代码）保留 90 天用于审计和趋势分析。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. 第三方服务</h2>
            <p>我们使用以下第三方服务：Vercel（托管）、Neon（数据库）、Claude API / OpenAI API（AI 分析）。这些服务均符合 SOC 2 合规标准。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. 你的权利</h2>
            <p>你有权访问、更正、删除你的数据。联系 privacy@prwise.dev 行使这些权利。我们将在 7 个工作日内响应。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
