'use client';

import { useState } from 'react';
import { useLang } from '@/context/LangContext';

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-slate-300 my-4">
      <code>{children}</code>
    </pre>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-slate-800 pb-3">{title}</h2>
      <div className="space-y-4 text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center text-sm font-bold text-brand-400">
        {num}
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-200">{title}</h4>
        <div className="text-sm text-slate-400">{children}</div>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');

  const sections = [
    { titleKey: 'docs_quickstart_title', descKey: 'docs_quickstart_desc', time: '5 min' },
    { titleKey: 'docs_config_title', descKey: 'docs_config_desc', time: '10 min' },
    { titleKey: 'docs_api_title', descKey: 'docs_api_desc', time: '15 min' },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">{t('docs_title')}</h1>
          <p className="text-slate-400">{t('docs_sub')}</p>
        </div>

        {/* Quick nav cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {sections.map((s, i) => (
            <a
              key={i}
              href={`#${['quickstart', 'config', 'api'][i]}`}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-brand-500/30 transition"
            >
              <div className="text-xs text-slate-500 font-mono">{s.time}</div>
              <h3 className="font-semibold">{t(s.titleKey)}</h3>
              <p className="text-sm text-slate-400">{t(s.descKey)}</p>
            </a>
          ))}
        </div>

        {/* Quickstart */}
        <Section id="quickstart" title="快速开始">
          <p>PRwise 是一个基于 Next.js 的全栈应用，支持 AI 自动审查 GitHub Pull Request。以下是在本地运行的步骤。</p>

          <div className="space-y-6 mt-6">
            <Step num={1} title="克隆仓库并安装依赖">
              <CodeBlock>{`git clone https://github.com/Wen-huan-11/prwise.git
 cd prwise/next-app
 pnpm install`}</CodeBlock>
            </Step>

            <Step num={2} title="配置环境变量">
              <p>复制 <code className="text-brand-400 font-mono">.env.example</code> 为 <code className="text-brand-400 font-mono">.env</code>，并填写以下关键配置：</p>
              <CodeBlock>{`# 数据库 — 开发用本地 SQLite，生产用 Turso
 DATABASE_URL="file:./dev.db"

 # GitHub OAuth App — 去 https://github.com/settings/developers 创建
 # Authorization callback URL 填: http://localhost:3456/api/auth/callback/github
 GITHUB_CLIENT_ID=你的_Client_ID
 GITHUB_CLIENT_SECRET=你的_Client_Secret

 # NextAuth 密钥 — 运行 npx auth secret 自动生成
 AUTH_SECRET=你的密钥
 NEXTAUTH_URL=http://localhost:3456

 # GitHub Token — 用于获取 PR diff 和发布评论
 # 去 https://github.com/settings/tokens?type=beta 创建 (需要 repo 权限)
 GITHUB_TOKEN=ghp_xxx

 # Webhook 密钥 — 用于验证 GitHub Webhook 签名
 GITHUB_WEBHOOK_SECRET=任意随机字符串

 # DeepSeek API Key — 用于 AI 审查
 DEEPSEEK_API_KEY=sk-xxx
 DEEPSEEK_MODEL=deepseek-chat`}</CodeBlock>
            </Step>

            <Step num={3} title="初始化数据库">
              <CodeBlock>{`npx prisma generate
 npx prisma db push`}</CodeBlock>
            </Step>

            <Step num={4} title="启动开发服务器">
              <CodeBlock>{`pnpm dev`}</CodeBlock>
              <p>访问 <code className="text-brand-400 font-mono">http://localhost:3456</code></p>
            </Step>
          </div>
        </Section>

        {/* Configuration */}
        <Section id="config" title="配置指南">
          <h3 className="text-lg font-semibold text-slate-200 mt-6">GitHub OAuth App 配置</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400 mt-3">
            <li>前往 <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">GitHub Developer Settings</a></li>
            <li>点击 New OAuth App</li>
            <li>填写应用名称和主页 URL</li>
            <li>Authorization callback URL 填 <code className="text-slate-300 font-mono">http://localhost:3456/api/auth/callback/github</code></li>
            <li>创建后复制 Client ID 和 Client Secret 到 .env</li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-200 mt-8">GitHub Personal Access Token</h3>
          <p className="text-sm text-slate-400 mt-2">用于获取私有仓库的 PR diff 和发布审查评论。</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400 mt-3">
            <li>前往 <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">GitHub Tokens</a></li>
            <li>生成 Classic Token 或 Fine-grained Token</li>
            <li>至少勾选 <code className="text-slate-300 font-mono">repo</code> 和 <code className="text-slate-300 font-mono">read:org</code> 权限</li>
            <li>复制 Token 到 .env 的 GITHUB_TOKEN</li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-200 mt-8">Webhook 配置（可选）</h3>
          <p className="text-sm text-slate-400 mt-2">如果你想体验&quot;提交 PR 自动触发审查&quot;，需要配置 Webhook：</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400 mt-3">
            <li>安装 ngrok: <code className="text-slate-300 font-mono">ngrok http 3456</code></li>
            <li>获取 HTTPS URL（如 <code className="text-slate-300 font-mono">https://abc123.ngrok-free.app</code>）</li>
            <li>在目标 GitHub 仓库 Settings {'>'} Webhooks {'>'} Add webhook</li>
            <li>Payload URL 填 <code className="text-slate-300 font-mono">https://abc123.ngrok-free.app/api/github/webhook</code></li>
            <li>Content type 选 <code className="text-slate-300 font-mono">application/json</code></li>
            <li>Secret 填 .env 里的 GITHUB_WEBHOOK_SECRET</li>
            <li>事件选择 Pull requests</li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-200 mt-8">Turso 云数据库（生产部署）</h3>
          <p className="text-sm text-slate-400 mt-2">SQLite 本地文件无法部署到 Vercel/Zeabur，需要使用 Turso：</p>
          <CodeBlock>{`# 1. 注册 Turso: https://turso.tech
 # 2. 创建数据库
 turso db create prwise-db

 # 3. 获取连接信息
 turso db show prwise-db
 turso db tokens create prwise-db

 # 4. 填入 .env
 DATABASE_URL="libsql://你的数据库-url"
 TURSO_AUTH_TOKEN="你的-token"`}</CodeBlock>
        </Section>

        {/* API Reference */}
        <Section id="api" title="API 参考">
          <p className="text-sm text-slate-400">PRwise 提供以下 RESTful API 端点。</p>

          <div className="space-y-6 mt-6">
            {/* Auth */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono font-bold">GET</span>
                <code className="text-sm font-mono text-slate-300">/api/auth/signin/github</code>
              </div>
              <div className="p-4 text-sm text-slate-400">
                GitHub OAuth 登录入口。由 NextAuth.js 自动处理，前端调用 <code className="text-slate-300 font-mono">signIn(&apos;github&apos;)</code> 即可。
              </div>
            </div>

            {/* Reviews - GET */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono font-bold">GET</span>
                <code className="text-sm font-mono text-slate-300">/api/reviews</code>
                <span className="text-xs text-slate-500 ml-auto">需要登录</span>
              </div>
              <div className="p-4 space-y-2 text-sm text-slate-400">
                <p>获取当前登录用户的审查历史列表，包含关联的仓库和发现问题详情。</p>
                <p className="text-xs text-slate-500 font-mono">Response: Review[] with repository & findings</p>
              </div>
            </div>

            {/* Reviews - POST */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">POST</span>
                <code className="text-sm font-mono text-slate-300">/api/reviews</code>
              </div>
              <div className="p-4 space-y-3 text-sm text-slate-400">
                <p>创建一次代码审查。支持两种模式：</p>

                <div className="pl-4 border-l-2 border-slate-700">
                  <p className="font-medium text-slate-300">模式 A：Demo 代码片段（无需登录）</p>
                  <CodeBlock>{`POST /api/reviews
 Content-Type: application/json

 {
   "code": "function getUser(id) { return fetch(...); }",
   "lang": "zh"
 }`}</CodeBlock>
                </div>

                <div className="pl-4 border-l-2 border-slate-700">
                  <p className="font-medium text-slate-300">模式 B：PR URL 审查（需要登录）</p>
                  <CodeBlock>{`POST /api/reviews
 Content-Type: application/json

 {
   "prUrl": "https://github.com/owner/repo/pull/123",
   "lang": "zh"
 }`}</CodeBlock>
                </div>
              </div>
            </div>

            {/* Repositories */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono font-bold">GET</span>
                <code className="text-sm font-mono text-slate-300">/api/repositories</code>
                <span className="text-xs text-slate-500 ml-auto">需要登录</span>
              </div>
              <div className="p-4 text-sm text-slate-400">
                获取当前用户关联的仓库列表，包含每个仓库的审查次数统计。
              </div>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-mono font-bold">DELETE</span>
                <code className="text-sm font-mono text-slate-300">/api/repositories?id=xxx</code>
                <span className="text-xs text-slate-500 ml-auto">需要登录</span>
              </div>
              <div className="p-4 text-sm text-slate-400">
                删除指定仓库及其关联的审查记录。只能删除自己名下的仓库。
              </div>
            </div>

            {/* Stats */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-mono font-bold">GET</span>
                <code className="text-sm font-mono text-slate-300">/api/stats</code>
              </div>
              <div className="p-4 space-y-2 text-sm text-slate-400">
                <p>获取平台统计数据。</p>
                <CodeBlock>{`{
   "users": 42,
   "repositories": 15,
   "reviews": 128,
   "findings": 356
 }`}</CodeBlock>
              </div>
            </div>

            {/* Webhook */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">POST</span>
                <code className="text-sm font-mono text-slate-300">/api/github/webhook</code>
              </div>
              <div className="p-4 space-y-2 text-sm text-slate-400">
                <p>GitHub Webhook 接收端点。接收 PR 的 opened/synchronize 事件，自动触发 AI 审查并将结果发布回 PR 评论。</p>
                <p className="text-xs text-slate-500">Headers: X-GitHub-Event, X-Hub-Signature-256</p>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ within docs */}
        <Section id="troubleshooting" title="常见问题排查">
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-semibold text-slate-200 mb-2">登录后重定向回首页，没有进入 Dashboard？</h4>
              <p className="text-sm text-slate-400">检查 NEXTAUTH_URL 是否和实际访问地址一致。如果使用 ngrok，需要同步更新 NEXTAUTH_URL。</p>
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-semibold text-slate-200 mb-2">AI 审查返回&quot;Review failed&quot;？</h4>
              <p className="text-sm text-slate-400">检查 DEEPSEEK_API_KEY 是否有效，以及网络是否能访问 api.deepseek.com。</p>
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-semibold text-slate-200 mb-2">Webhook 签名验证失败？</h4>
              <p className="text-sm text-slate-400">确保 GitHub Webhook 配置的 Secret 和 .env 里的 GITHUB_WEBHOOK_SECRET 完全一致（包括大小写）。</p>
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-semibold text-slate-200 mb-2">数据库报错&quot;table not found&quot;？</h4>
              <p className="text-sm text-slate-400">运行 <code className="text-slate-300 font-mono">npx prisma db push</code> 创建表结构。</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
