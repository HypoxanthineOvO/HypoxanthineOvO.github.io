export type Locale = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Project {
  slug: string;
  name: string;
  label: LocalizedText;
  description: LocalizedText;
  category: 'research' | 'systems' | 'writing' | 'tools';
  period: string;
  status: 'current' | 'active' | 'archive';
  tech: string[];
  url?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'cryo-gpu',
    name: 'Cryo-GPU',
    label: { zh: '当前研究', en: 'Current research' },
    description: {
      zh: '面向 77 K GPU 架构的证据驱动设计空间探索，以可复现建模、参数合成与仿真连接器件变化和系统资源配置。',
      en: 'Evidence-guided design-space exploration for GPU architectures at 77 K, connecting device shifts to system allocation through reproducible modeling and simulation.',
    },
    category: 'research',
    period: '2026 — NOW',
    status: 'current',
    tech: ['Cryogenic GPU', 'GPU Architecture', '77 K', 'Accel-Sim', 'Modeling'],
    featured: true,
  },
  {
    slug: 'vspi',
    name: 'VSPi',
    label: { zh: 'Agent 终端', en: 'Agent terminal' },
    description: {
      zh: '面向 Pi coding agents 的中文终端界面，把多会话、模型切换与只读工作流状态收进一个紧凑 TUI。',
      en: 'A Chinese terminal UI for Pi coding agents, unifying sessions, model switching, and read-only workflow state in a focused TUI.',
    },
    category: 'systems',
    period: '2026 — NOW',
    status: 'active',
    tech: ['TypeScript', 'TUI', 'Agents'],
    url: 'https://github.com/HypoxanthineOvO/VSPi',
    featured: true,
  },
  {
    slug: 'hypo-workflow',
    name: 'Hypo-Workflow',
    label: { zh: '可恢复工作流', en: 'Recoverable workflow' },
    description: {
      zh: '为 coding agents 提供文件化 Cycle、Discussion、Plan、Progress 与 Memory，让长任务可讨论、可恢复、可验收。',
      en: 'A file-first workflow for coding agents, making long tasks discussable, recoverable, and reviewable through Cycles, Plans, Progress, and Memory.',
    },
    category: 'systems',
    period: '2026 — NOW',
    status: 'active',
    tech: ['JavaScript', 'Agent Workflow', 'CLI'],
    url: 'https://github.com/HypoxanthineOvO/Hypo-Workflow',
    image: '/media/projects/hypo-workflow.webp',
    featured: true,
  },
  {
    slug: 'hypodoc',
    name: 'HypoDoc',
    label: { zh: 'AI-first 文档系统', en: 'AI-first documents' },
    description: {
      zh: '结构化 Markdown 规范与 parser、Web/LaTeX renderer、Desktop 和 VS Code 产品工作区。',
      en: 'A structured Markdown specification with parsers, Web/LaTeX renderers, and Desktop and VS Code authoring surfaces.',
    },
    category: 'systems',
    period: '2026 — NOW',
    status: 'active',
    tech: ['Markdown', 'Rust', 'TypeScript', 'LaTeX'],
    url: 'https://github.com/HypoxanthineOvO/HypoDoc',
    image: '/media/projects/hypodoc.webp',
    featured: true,
  },
  {
    slug: 'hypo-writer',
    name: 'Hypo-Writer',
    label: { zh: '中文创作工作流', en: 'Chinese writing workflow' },
    description: {
      zh: '本地优先的中文创作系统，覆盖资料、事实卡、大纲、审阅以及公众号、小红书等多平台发布包。',
      en: 'A local-first Chinese writing system spanning sources, fact cards, outlines, review, and multi-channel publication packages.',
    },
    category: 'writing',
    period: '2026 — NOW',
    status: 'active',
    tech: ['TypeScript', 'Content Pipeline', 'WeChat'],
    url: '/wechat',
    image: '/media/projects/hypo-writer.webp',
    featured: true,
  },
  {
    slug: 'vsp-codex',
    name: 'VSP-Codex',
    label: { zh: '研究型编程 Agent', en: 'Research coding agent' },
    description: {
      zh: '面向 VSP Lab 场景维护的 Codex source-build 版本，公开镜像与 GitLab 主线协同演化。',
      en: 'A VSP Lab-oriented Codex source build, with a public mirror and canonical GitLab history evolving together.',
    },
    category: 'systems',
    period: '2026 — NOW',
    status: 'active',
    tech: ['Rust', 'TypeScript', 'Codex'],
    url: 'https://github.com/HypoxanthineOvO/VSP-Codex',
    featured: true,
  },
  {
    slug: 'hypoxanthine-latex',
    name: 'Hypoxanthine-LaTeX',
    label: { zh: '个人排版生态', en: 'Personal typesetting stack' },
    description: {
      zh: '模块化 LaTeX 排版生态，统一 Notes、Cheatsheets、Docs 与 Slides 的构建和视觉语言。',
      en: 'A modular LaTeX ecosystem unifying the build and visual language of notes, cheatsheets, documents, and slides.',
    },
    category: 'tools',
    period: '2026 — NOW',
    status: 'active',
    tech: ['LaTeX', 'Build Systems'],
    url: 'https://github.com/HypoxanthineOvO/Hypoxanthine-LaTeX',
    featured: false,
  },
  {
    slug: 'shtu-ppt-template',
    name: 'SHTU-PPT-Template',
    label: { zh: '开放教学模板', en: 'Open teaching templates' },
    description: {
      zh: '上海科技大学 PowerPoint、Marp 与 Beamer 模板，服务真实课程和技术分享。',
      en: 'PowerPoint, Marp, and Beamer templates for ShanghaiTech courses and technical presentations.',
    },
    category: 'tools',
    period: '2024 — NOW',
    status: 'active',
    tech: ['Marp', 'Beamer', 'PowerPoint'],
    url: 'https://github.com/HypoxanthineOvO/SHTU-PPT-Template',
    featured: false,
  },
  {
    slug: 'neural-rendering',
    name: 'Neural Rendering Accelerators',
    label: { zh: '研究起点', en: 'Research origin' },
    description: {
      zh: '从 NeRF、神经体渲染到硬件加速与稀疏采样的研究轨迹，形成了从应用特定加速走向 GPU 架构研究的起点。',
      en: 'Earlier work across NeRF, neural volume rendering, hardware acceleration, and sparse sampling that led toward broader GPU architecture research.',
    },
    category: 'research',
    period: '2022 — 2026',
    status: 'archive',
    tech: ['NeRF', 'RTL', 'FPGA', 'ASIC'],
    url: '/publications',
    image: '/media/projects/neural-rendering.webp',
    featured: false,
  },
];

export const researchTimeline = [
  {
    period: '2026 — NOW',
    title: { zh: 'Cryogenic GPU Systems', en: 'Cryogenic GPU Systems' },
    text: {
      zh: '以 77 K 为目标环境，沿着证据、参数合成、GPU tracing、仿真与设计空间探索建立可复现研究链。',
      en: 'Building a reproducible chain from evidence and parameter synthesis to GPU tracing, simulation, and design-space exploration at 77 K.',
    },
  },
  {
    period: '2024 — 2026',
    title: { zh: 'GPU 架构与系统方法', en: 'GPU architecture and systems' },
    text: {
      zh: '从单个神经渲染加速器扩展到 workload、memory hierarchy、scheduling 与系统建模。',
      en: 'Expanding from individual neural-rendering accelerators toward workloads, memory hierarchies, scheduling, and system modeling.',
    },
  },
  {
    period: '2022 — 2025',
    title: { zh: '神经渲染硬件加速', en: 'Neural-rendering acceleration' },
    text: {
      zh: '围绕 ray representation、sampling、data reuse 与 conflict-free encoding 完成从算法分析到硬件设计的研究。',
      en: 'Research spanning algorithm analysis and hardware design for ray representation, sampling, data reuse, and conflict-free encoding.',
    },
  },
];

export function localize(text: LocalizedText, locale: Locale) {
  return text[locale];
}
