export const siteConfig = {
  site: 'https://hypox.cn',
  title: '贺云翔 / Hypoxanthine',
  description: '贺云翔（Hypoxanthine）：77 K 低温 GPU 研究者、系统构建者与科学写作者。',
  author: 'Yunxiang He',
  tagline: '贺云翔 / Yunxiang He · Hypoxanthine',
  subtitle: 'Cryogenic GPU Systems · Computer Architecture · AI Tooling',
  email: 'hyx021203@163.com',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/media/profile/yunxiang-he.webp',
};

export const navLinks = [
  { href: '/work', label: '项目', labelEn: 'Work' },
  { href: '/research', label: '研究', labelEn: 'Research' },
  { href: '/wechat', label: '公众号', labelEn: 'WeChat' },
  { href: '/archive', label: '档案', labelEn: 'Archive' },
  { href: '/about', label: '关于', labelEn: 'About' },
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
