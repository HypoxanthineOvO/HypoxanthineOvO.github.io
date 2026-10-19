// 首页上不来自内容集合的数据：群像名牌、最近动态、Minecraft 展示、关于区。

// 群像头像上的名牌位置（百分比坐标，对应 /media/brand/avatar-group.webp）
export const avatarTags = [
  { name: '我', org: '贺云翔', color: '#3b6fb6', x: 50, y: 55 },
  { name: 'Claude', org: 'Anthropic', color: '#d9773a', x: 50, y: 12 },
  { name: 'GPT', org: 'OpenAI', color: '#6b6b6b', x: 22, y: 23 },
  { name: 'Kimi', org: '月之暗面', color: '#1c1b1a', x: 80, y: 20 },
  { name: 'GLM', org: '智谱', color: '#3a5bd9', x: 89, y: 44 },
  { name: 'Gemini', org: 'Google', color: '#8a6de9', x: 80, y: 76 },
  { name: 'DeepSeek', org: '深度求索', color: '#2f5fd0', x: 15, y: 73 },
  { name: '豆包', org: '字节跳动', color: '#b88a4a', x: 50, y: 91 },
];

// 最近动态：新的在前
export const recent = [
  { date: '10·17', text: '盘龙魔法模组 0.6 发布', href: '/work#minecraft' },
  { date: '10·16', text: '新文章《一年挂名 78 篇的博导们》', href: '/content/slow-research' },
  { date: '10·16', text: '新视频「AI 写的东西，为什么一眼就能认出来」', href: '/content/video-ai-flavor' },
  { date: '10·15', text: 'Hypo-Expression v1.1.0 发布', href: '/work/hypo-expression' },
  { date: '10·15', text: 'VSPi 3.0 pre 发布', href: '/work/vspi' },
];

// Minecraft 展示：work 对应 projects 集合里的条目 id
export const mcWorks = {
  hypomc: { badge: 'HypoMC', title: '生存整合包', icon: '/media/icons/hypomc.webp' },
  panlong: { badge: '盘龙', title: '魔法战斗模组', icon: '/media/icons/panlong.webp' },
} as const;

export const mcShots: { work: keyof typeof mcWorks; color: string; name: string; desc: string; img: string }[] = [
  { work: 'hypomc', color: '#4f8fd6', name: '地图', desc: '村庄自动命名、地点搜索、洞穴层切换。', img: '/media/mc/map.jpg' },
  { work: 'hypomc', color: '#5ad1c4', name: '盾牌', desc: '守御、盾反、广域三种盾牌附魔，装备后浮现魔法盾。', img: '/media/mc/shield.jpg' },
  { work: 'hypomc', color: '#ffd25a', name: '光照', desc: '附魔火把：防水、辉光、空间之光。', img: '/media/mc/lights.jpg' },
  { work: 'panlong', color: '#b9a8ff', name: '雷狱', desc: '持续雷网，雷电熔化地表。', img: '/media/mc/thunder.jpg' },
  { work: 'panlong', color: '#ff7a3d', name: '焚天', desc: '大范围火雨，焚烧地形。', img: '/media/mc/inferno.jpg' },
  { work: 'panlong', color: '#9fc8d8', name: '风暴', desc: '可成长的龙卷，卷起地形方块。', img: '/media/mc/storm.jpg' },
  { work: 'panlong', color: '#7fe0ff', name: '次元之刃', desc: '远程斩击，切开远处山体。', img: '/media/mc/blade.jpg' },
  { work: 'panlong', color: '#e0503a', name: '陨石', desc: '召唤陨石，撞击形成陨坑。', img: '/media/mc/meteor.jpg' },
];

// 研究区：现在的两条主线
export const researchNow = {
  cryo: { title: '低温计算', desc: '77 K 液氮温区下的 GPU 设计空间探索，目标综合能效 15 倍。' },
  gpu: { title: 'GPU 模拟器', desc: '3090 Ti / 4090 / 5090 逐卡校准，误差低于 MICRO 2025 基线。' },
};

export const facets = [
  { title: '乒乓球', text: '业余选手' },
  { title: '助教', text: '古代文学课、信息学院课程' },
  { title: '文学爱好', text: '诗词三部合集，散文四篇' },
  { title: '游戏', text: 'Minecraft' },
];
