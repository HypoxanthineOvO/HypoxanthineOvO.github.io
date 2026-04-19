export const siteConfig = {
  site: 'https://hypoxanthineovo.github.io',
  title: 'Hypoxanthine',
  description: 'ShanghaiTech VSPLab 研究生，方向 Cryo Computing × AI Acceleration。也写一些非技术的东西。',
  author: 'Yunxiang He',
  tagline: 'Hypoxanthine (Yunxiang He)',
  subtitle: 'ShanghaiTech · VSPLab · Cryo Computing × AI Acceleration',
  email: 'hyx021203@163.com',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/avatar.jpg',
};

export const navLinks = [
  { href: '/', label: '首页' },
  { href: '/series', label: '系列' },
  { href: '/tags', label: '标签' },
  { href: '/projects', label: '项目' },
  { href: '/publications', label: '发表' },
  { href: '/courses', label: '课程' },
  { href: '/about', label: '关于' },
];

export const socialLinks = [
  { href: siteConfig.github, label: 'GitHub' },
  { href: `mailto:${siteConfig.email}`, label: 'Email' },
];

export const knownTags = [
  'literary-essay',
  'creative-writing',
  'gpu-research',
  'lecture-notes',
  'tooling-notes',
  'engineering-practice',
  'course-material',
] as const;
