export const siteConfig = {
  site: 'https://hypox.cn',
  title: '飘零 · Hypoxanthine',
  description: '飘零（Hypoxanthine）：AI 加速器与 77 K 低温 GPU 博士在读，高阶 AI Agent 造轮子与模型深度体验者。视频、文章、项目与研究。',
  author: 'Hypoxanthine',
  name: '飘零',
  brand: '飘零',
  brandEn: 'Hypoxanthine',
  tagline: '深度 AI 造轮子与模型评测｜77 K 低温 GPU 博士在读',
  affil: '上海科技大学 VSP Lab',
  advisor: '',
  email: 'hyx021203@163.com',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/media/brand/avatar-group.webp',
  logo: '/media/brand/leaf.png',
};

export interface Platform {
  key: string;
  label: string;
  handle?: string;
  href?: string;
  primary?: boolean;
}

// 视频号与公众号没有可跳转的公开主页，只展示名字
export const platforms: Platform[] = [
  { key: 'wechat', label: '公众号', handle: 'Hypoxanthine', primary: true },
  { key: 'douyin', label: '抖音', handle: '飘零聊科技' },
  { key: 'bilibili', label: 'B站', href: 'https://space.bilibili.com/25585120' },
  { key: 'channels', label: '视频号', handle: 'Hypoxanthine' },
  { key: 'xiaohongshu', label: '小红书', href: 'https://www.xiaohongshu.com/user/profile/6723bab7000000001c0196b8' },
  { key: 'github', label: 'GitHub', href: siteConfig.github },
];

export const platformLabel: Record<string, string> = Object.fromEntries(platforms.map((p) => [p.key, p.label]));
