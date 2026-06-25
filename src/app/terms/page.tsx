'use client';

import { useLang } from '@/context/LangContext';

export default function TermsPage() {
  const { t } = useLang();

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">{t('terms_title')}</h1>
          <p className="text-slate-400">{t('terms_desc')}</p>
          <p className="text-xs text-slate-600">Last updated: June 2026</p>
        </div>
        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. 服务说明</h2>
            <p>PRwise 提供 AI 驱动的 Pull Request 代码审查服务。通过安装 GitHub App 并授权，服务将自动审查你的 Pull Request 并返回审查结果。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. 订阅与付费</h2>
            <p>免费版：50 次审查/月，仅公开仓库。Pro 版：$49/月，无限审查，私有仓库支持。Team 版：$199/月，10 席位，SSO 支持。所有价格不含税。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. 使用限制</h2>
            <p>禁止滥用 API（包括但不限于：超出速率限制、逆向工程、自动化爬取）。我们保留对滥用行为暂停服务的权利。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. 服务可用性</h2>
            <p>我们承诺 99.5% 的服务可用性（SLA）。维护窗口提前 48 小时通知。因 LLM API 供应商导致的中断不在 SLA 范围内。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. 终止</h2>
            <p>任一方可随时终止服务。终止后，你的数据将在 30 天内删除。已支付的费用不予退还（除非我们违反 SLA）。</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. 联系我们</h2>
            <p>如有问题请联系 legal@prwise.dev。本条款的最终解释权归 PRwise 所有。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
