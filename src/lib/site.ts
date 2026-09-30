export const siteConfig = {
  site: 'https://hypox.cn',
  title: '贺云翔 / Hypoxanthine',
  description: '贺云翔（Hypoxanthine）：77 K 低温 GPU 研究者、系统构建者与科学写作者。',
  author: 'Yunxiang He',
  signature: '贺云翔',
  affil: '上海科技大学 · VSP Lab',
  email: 'hyx021203@163.com',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/media/profile/yunxiang-he.webp',
};

// 引流矩阵：知乎/B站/公众号主页地址后补；公众号先指向发布门
export const socialLinks = [
  { href: siteConfig.github, label: 'GitHub' },
  { href: `mailto:${siteConfig.email}`, label: 'Email' },
  { href: '/publish', label: '公众号' },
];
