---
name: "Hypo-Info"
emoji: "📡"
status: "active"
githubUrl: "https://github.com/HypoxanthineOvO/Hypo-Info"
group: productivity
layer: ai-product
tier: stable
version: "v2.0"
icon: "/media/icons/hypo-info.webp"
order: 5
featured: true
tech: ["X 网页抓取","RSS/Newsletter","证据链去重","AI 质量层"]
description: "全网多源信息采集与提纯引擎：除常规 RSS 与顶流 Newsletter 外，接入 6 大分组 X 账号网页抓取，经相似度去重与 AI 质量层输出带原始证据卡的每日简报。"
highlights:
  - { value: "6 组 X + RSS", label: "多通道一手信源采集" }
  - { value: "≥0.92", label: "多源相似度去重合并" }
  - { value: "证据链", label: "保留原文与抓取状态" }
---

Hypo-Info 不是传统的新闻门户，而是一套重点解决<strong>「信息从哪来、怎么去水」</strong>的自动化采集与提纯管线。

### 一、多通道信源采集架构

系统维护 1300 余行信源配置，将分散在不同介质的一手信号拉入同一套流水线：

- **X (Twitter) 6 大分组网页会话抓取**：摒弃受限且昂贵的付费 API，基于已登录 Chromium CDP 会话按不同频率滚动采集 6 类核心信源（`companies` 官方账号、`people` 核心研究者、`longtail` 深度观察者、`watchers` 行业追踪、`robotics` 具身智能、`ic` 芯片与硬件架构）。优先提取页面 GraphQL 时间线并支持 DOM 回退，自动过滤时间窗口外的置顶旧帖。
- **一手研究博客与深度 Newsletter**：覆盖 OpenAI、DeepMind、Google AI、Qwen、NVIDIA 等官方技术博客，以及 TLDR、橘鸦、Simon Willison、Interconnects、Ahead of AI、Latent Space、Import AI 等长文通讯。
- **开发者与产品社区**：接入 GitHub Trending、Hugging Face、Show HN、Product Hunt 与主流中文科技媒体。

### 二、确定性去重与 AI 质量分级流水线

1. **规范化与多源证据合并**：剥离追踪参数后，按 URL 哈希、标题哈希与 `SequenceMatcher ≥ 0.92` 逐级合并同一事件，将不同渠道的报道聚合为同一词条下的 `EvidenceLink` 证据链。
2. **低信息密度预过滤**：对纯转发、纯表情、不足 40 字符的碎片推文在进入大模型前直接走确定性规则拦截，节省算力并降低噪声。
3. **AI 分析 + 确定性质量权重**：结合大模型结构化提取与确定性质量系数（拉高一手发布与硬核评测权重，降权泛泛闲聊与无法核实的传闻），生成每日最多 50 条高信噪比摘要，并为每条结论保留可回溯的原始证据卡。
