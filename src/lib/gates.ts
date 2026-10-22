// 站点分区注册表：导航与分区页眉都由它驱动。
export interface Gate {
  slug: string;
  name: string;
  en: string;
  href: string;
  accent: string;
  blurb: string;
}

export const gates: Gate[] = [
  { slug: 'content', name: '内容', en: 'CONTENT', href: '/content', accent: '#a3292a', blurb: '视频与文章' },
  { slug: 'work', name: '项目', en: 'PROJECTS', href: '/work', accent: '#2f6b3a', blurb: 'AI 能力树三层：Agent 底座、日常产品与 Minecraft' },
  { slug: 'research', name: '研究', en: 'RESEARCH', href: '/research', accent: '#2b4f86', blurb: '神经渲染与 77 K 低温 GPU 双轨时间线' },
  { slug: 'writing', name: '写作', en: 'WRITING', href: '/writing', accent: '#8a5a2b', blurb: '诗词、散文与学习档案' },
  { slug: 'essays', name: '散文', en: 'ESSAYS', href: '/essays', accent: '#9e2b25', blurb: '散文随笔' },
  { slug: 'poetry', name: '诗词', en: 'POETRY', href: '/poetry', accent: '#8a5a2b', blurb: '诗词合集' },
  { slug: 'study', name: '学习档案', en: 'STUDY', href: '/study', accent: '#4a6b4f', blurb: '按学期归档' },
];

// 写作下的子栏目在导航里归到「写作」高亮
const writingChildren = ['/essays', '/poetry', '/study'];

export const navLinks = [
  { href: '/content', label: '内容', match: ['/content'] },
  { href: '/work', label: '项目', match: ['/work'] },
  { href: '/research', label: '研究', match: ['/research'] },
  { href: '/writing', label: '写作', match: ['/writing', ...writingChildren] },
  { href: '/about', label: '关于', match: ['/about'] },
];
