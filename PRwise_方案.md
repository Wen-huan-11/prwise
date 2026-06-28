# AI QA Agent — 独立开发者产品方案

## 一、市场洞察（为什么要做这个）

### 核心逻辑链

```
AI 编程工具爆发（Copilot/Cursor/Codex/vibe coding）
       ↓
代码生成量 10x 增长
       ↓
传统 QA 成为瓶颈（testing bottleneck）
       ↓
AI QA Agent 是自然解
```

### 数据集关键信号（shaurya03/tech-news-daily）

| 信号 | 数据 | 含义 |
|------|------|------|
| AI Coding 关键词总提及 | 84+98+86+49+47 = 364次 | AI 编程已成主流 |
| Agentic/AI Agent 提及 | 247+403 = 650次 | 行业全面转向 Agent |
| BotGauge AI 融资 | $2M (Feb 2026) | Agentic QA 获 VC 认可 |
| TesterArmy (YC W26) | 2026年6月上线 | YC 验证此方向 |
| Mozark 融资 | $40M Series B | 大额资本涌入 |
| "ai pr" 提及 | 160次 | AI 生成的 PR/代码量暴增 |
| "testing bottleneck" | 明确提及 | 瓶颈已被行业认知 |
| Microsoft AI behavior test tool | 2026年6月发布 | 巨头入场验证 |

### 为什么是独立开发者的机会

- 市场处于早期：第一代 AI 测试工具（mabl/Testim）太贵太重，新一代（BotGauge/TesterArmy）刚起步
- 技术成熟：Playwright + LLM API 可单人搞定
- 获客渠道明确：GitHub Marketplace + HN/PH 精准触达开发者
- 变现路径清晰：SaaS 订阅模式

---

## 二、产品定义

### 2.1 第一版本：AI PR Review Agent

**一句话描述**：自动审查 Pull Request 的 AI Agent，发现 Bug、安全问题、代码质量问题。

**目标用户**：中小技术团队（2-20 人）、独立开发者

**核心功能**：

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 自动 PR Diff 分析 | 读取 PR 变更，逐文件审查 | P0 |
| Bug 检测 | 逻辑错误、边界条件遗漏、空指针等 | P0 |
| 安全漏洞扫描 | SQL 注入、XSS、密钥泄露、依赖风险 | P0 |
| 代码质量评分 | 复杂度、可维护性、最佳实践 | P0 |
| 修改建议 | 具体代码块级建议（可一键复制） | P0 |
| CI 集成 | GitHub Actions / GitLab CI 集成 | P1 |
| 自定义规则 | 团队自己的编码规范 | P1 |
| 多语言支持 | JS/TS/Python/Go/Rust 等 | P1 |

### 2.2 第二版本：AI E2E Test Generator（可选扩展）

在第一版基础上增加：输入 URL → AI 探索应用 → 自动生成 Playwright E2E 测试。

### 2.3 非功能目标

- 每次 Review 耗时 < 30 秒
- 每项目成本 < $0.50/天（LLM API）
- 准确率 > 85%（可调节敏感度）

---

## 三、技术架构

```
用户 GitHub PR Webhook
        │
        ▼
┌──────────────────────────────────┐
│        Agent 编排层              │
│  LangChain / Vercel AI SDK      │
│  - 任务拆解：按文件拆分子任务      │
│  - 上下文组装：Diff + 相关代码     │
│  - 结果合并：去重 + 优先级排序     │
└──────────────┬───────────────────┘
               │
       ┌───────┼───────────┐
       ▼       ▼           ▼
┌─────────┐ ┌──────┐ ┌──────────┐
│ Static  │ │  LLM  │ │ Security │
│ Analysis│ │Review │ │  Scan    │
│(ESLint/ │ │(Claude│ │(Trivy/   │
│ Pyright)│ │Sonnet)│ │ Semgrep) │
└─────────┘ └──────┘ └──────────┘
       │       │           │
       └───────┼───────────┘
               ▼
┌──────────────────────────────────┐
│        结果聚合 & Post          │
│  - 生成 PR Comment              │
│  - 设置 Commit Status (pass/fail)│
│  - 可选：自动创建 Issue          │
└──────────────────────────────────┘
```

### 技术选型

| 层 | 技术 | 理由 |
|----|------|------|
| 前端 | Next.js + Tailwind + shadcn/ui | 快速迭代 |
| 后端 API | Next.js API Routes | 零额外运维 |
| Agent 框架 | Vercel AI SDK (or LangChain) | 流式输出、工具调用 |
| LLM | Claude Sonnet 4 (首选) / GPT-5.x | 代码理解最强 |
| 浏览器自动化 | Playwright | E2E 扩展时使用 |
| 数据库 | PostgreSQL (Neon 免费版) | 按量付费 |
| 部署 | Vercel + GitHub Actions | 低 ops 成本 |
| 缓存 | Redis (Upstash) | 增量 diff 缓存 |
| 异步队列 | Inngest | PR review 异步处理 |

### 单人开发周期

| 阶段 | 时长 | 产出 |
|------|------|------|
| MVP | 2-3 周 | 核心 PR Review + GitHub App |
| Beta | +2-3 周 | CI 集成 + 自定义规则 + 付费计划 |
| 上线 | +1-2 周 | GitHub Marketplace + 定价上线 |
| **总计** | **6-8 周** | 可收费产品 |

---

## 四、商业模式

### 定价方案

| 版本 | 价格 | 核心限制 | 目标客户 |
|------|------|----------|----------|
| Free | $0 | 50次/月，仅公开仓库 | 个人开发者，口碑传播 |
| Pro | $49/月 | 无限次，私有仓库，CI 集成 | 小团队（2-10人） |
| Team | $199/月 | 5席位，SSO，自定义规则，优先支持 | 中型团队（10-50人） |

### 成本结构（估算）

| 项目 | 月成本 | 备注 |
|------|--------|------|
| Vercel 部署 | $20 | Pro 计划 |
| LLM API | ~$0.002/次 | Claude Sonnet，按量 |
| 数据库 | $0-19 | Neon 免费版或 $19 版 |
| 第三方服务 | $0-30 | Upstash, Sentry 等 |
| **每千次 Review 成本** | **~$7** | 含 LLM + 基础设施 |

### 盈亏平衡

- 免费版带来口碑
- 20 个 Pro 用户（$980/月）覆盖所有成本
- 50 个 Pro 用户即盈利

---

## 五、获客策略

### 渠道矩阵

| 渠道 | 优先级 | 方式 | 预期效果 |
|------|--------|------|----------|
| GitHub Marketplace | ⭐⭐⭐ | Free tier 上架 | 自然流量，精准开发者 |
| Hacker News Show HN | ⭐⭐⭐ | 发布 + 透明分享 | 500-2000 初始用户 |
| Product Hunt | ⭐⭐ | 正式版时发布 | 品牌曝光 |
| 开发者社区 | ⭐⭐ | Twitter/X + Reddit + Discord | 口碑传播 |
| AI 编程工具互补推广 | ⭐⭐⭐ | Cursor/Copilot 插件生态 | 精准用户 |

### 增长飞轮

```
Free tier → 开发者试用 → PR review 有效 → 团队内推广
  → 团队升级 Pro → 口碑传播 → 更多 Free 用户
```

---

## 六、竞争定位

### 差异化

| 对比对象 | 他们的问题 | 我们的优势 |
|----------|-----------|-----------|
| GitHub Code Review (Copilot) | 侧重安全，非全面代码审查 | 全维度评审 + 自定义规则 |
| mabl / Testim | 太重、$500+/月、配置复杂 | 轻量、$49 起、零配置 |
| SonarQube | 静态分析、大量误报、配置复杂 | AI 语境理解、低误报率 |
| BotGauge AI | 企业定位、印度市场 | 全球化 + 独立开发者定价 |
| TesterArmy (YC) | E2E 测试（不同赛道） | PR Review 切入，互补关系 |

### 护城河建设

1. **数据飞轮**：更多 PR 审查 → 更多反馈数据 → 模型更准 → 更多用户
2. **自定义规则市场**：用户可创建/分享审查规则（社区网络效应）
3. **CI 深度集成**：从 PR Review → E2E 测试 → 全流水线

---

## 七、里程碑规划

| 时间 | 里程碑 | 关键指标 |
|------|--------|----------|
| Week 1-2 | MVP 开发完成 | 核心 PR Review 功能 |
| Week 3-4 | GitHub Marketplace 上架 + Show HN | 500+ 安装 |
| Week 5-6 | CI 集成 + 付费计划上线 | 10+ 付费用户 |
| Week 7-8 | 用户反馈迭代 + 自定义规则 | 30+ 付费用户，NPS > 40 |
| Month 3-4 | 扩展到 E2E 测试生成 | 100+ 付费用户 |
| Month 5-6 | 评估融资或全职投入 | ARR > $60K |

---

## 八、风险与应对

| 风险 | 应对 |
|------|------|
| TesterArmy 快速覆盖 PR Review | 先发优势 + 快速迭代 + 聚焦差异化 |
| LLM 误报太多 | 默认"建议模式"而非"自动模式"，用户确认后执行 |
| GitHub/Microsoft 推出竞品 | 走独立平台 + 多 Git 服务支持（GitLab/Bitbucket） |
| 获客成本太高 | 纯 PLG + 口碑，不做付费投放 |
| 单人 burnout | 前 3 个月严格控制 scope，不做完美主义 |

---

## 九、下一步行动

1. **立即注册 GitHub App 开发者账号**（1 天）
2. **搭建 MVP 脚手架**：Next.js + Vercel AI SDK + GitHub App 框架（3 天）
3. **实现核心 PR Diff → LLM Review 管道**（5 天）
4. **在 5 个开源项目手动测试**（2 天）
5. **上架 GitHub Marketplace Free 层**（2 天）
6. **发 Show HN 获取第一批用户**（1 天）
7. **按用户反馈迭代 + 增加付费计划**（2 周）

> **总耗时：6-8 周即可上线收费**
