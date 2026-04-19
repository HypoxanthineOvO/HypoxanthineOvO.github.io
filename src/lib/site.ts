export const siteConfig = {
  site: 'https://hypoxanthineovo.github.io',
  title: 'Hypoxanthine',
  description: '何云翔的个人站点，收录文章、笔记、发表与 Hypo-* 项目。',
  author: 'Yunxiang He',
  tagline: 'Hypoxanthine (Yunxiang He)',
  email: 'contact@hypoxanthine.cn',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/avatar.jpg',
};

export const navLinks = [
  { href: '/posts', label: '文章' },
  { href: '/notes', label: '笔记' },
  { href: '/publications', label: '发表' },
  { href: '/projects', label: '项目' },
  { href: '/about', label: '关于' },
];

export const socialLinks = [
  { href: siteConfig.github, label: 'GitHub' },
  { href: `mailto:${siteConfig.email}`, label: 'Email' },
];
