// 门注册表：首页卡片墙与导航都由它驱动，加减门只改这里。
export interface Gate {
  slug: string;
  name: string;
  en: string;
  href: string;
  weight: number; // 卡片相对分量（桌面栅格列数参考）
  accent: string; // 识别色（进门沾色）
  blurb: string;
}

export const gates: Gate[] = [
  { slug: 'research', name: '研究', en: 'RESEARCH', href: '/research', weight: 6, accent: '#3d7a93', blurb: '学术发表' },
  { slug: 'work', name: '项目', en: 'WORK', href: '/work', weight: 6, accent: '#2f9e6e', blurb: '精选工程项目' },
  { slug: 'essays', name: '散文', en: 'ESSAYS', href: '/essays', weight: 4, accent: '#9e2b25', blurb: '散文随笔' },
  { slug: 'poetry', name: '诗词', en: 'POETRY', href: '/poetry', weight: 4, accent: '#8a5a2b', blurb: '诗词合集' },
  { slug: 'publish', name: '发布', en: 'PUBLISHING', href: '/publish', weight: 4, accent: '#b3541e', blurb: '长文与日报' },
  { slug: 'notes', name: '技术笔记', en: 'NOTES', href: '/notes', weight: 7, accent: '#3f6d9e', blurb: '笔记与备忘' },
  { slug: 'study', name: '学习档案', en: 'STUDY', href: '/study', weight: 5, accent: '#4a6b4f', blurb: '按学期归档' },
];

export const navLinks = [
  ...gates.map(({ href, name }) => ({ href, label: name })),
  { href: '/archive', label: '档案' },
  { href: '/about', label: '关于' },
];
