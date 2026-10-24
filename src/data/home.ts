// 首页与各分区的结构化数据：群像名牌、最近动态、AI 能力树分层、Minecraft 痛点模块与法术体系、科研双轨时间轴、关于区标签。

// 群像头像上的名牌位置（百分比坐标，对应 /media/brand/avatar-group.webp）
export const avatarTags = [
  { name: '我', org: '飘零', color: '#3b6fb6', x: 50, y: 55 },
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
  { date: '10·22', text: '新企划《蒸！天天抓“模型蒸馏”，到底怎么才叫蒸？》制作中', href: '/content' },
  { date: '10·19', text: '新视频《向量化人生 · 第 1 期：因为你活在别人的坐标系里》', href: '/content/video-vector-life-01' },
  { date: '10·19', text: 'HypoMC 生存整合包 7 大模块更新，开启独立详情页', href: '/work/hypomc' },
  { date: '10·18', text: '新视频《预训练和后训练：AI 是怎么学会东西的》', href: '/content/video-pretrain-posttrain' },
  { date: '10·18', text: '视频与长文《实锤！祖冲之蒸馏了 Claude，而圆周率蒸馏了 GPT》', href: '/content/video-distill-fingerprint' },
  { date: '10·16', text: '视频与长文《AI 写的东西，为什么一眼就能认出来》', href: '/content/video-ai-flavor' },
];

// 内容三个栏目
export const contentPillars = [
  {
    key: 'ai-basics',
    image: '/media/pillars/ai-basics.webp',
    badge: '',
    title: 'AI 科普 · 深入浅出',
    desc: '绝非仅仅浅尝辄止的介绍 AI 工具，而是带你深入 AI 的本质，带你走进前沿 AI 的大门。',
  },
  {
    key: 'vector-life',
    image: '/media/pillars/vector-life.webp',
    badge: '',
    title: '向量化人生',
    desc: '你的人生，绝不仅仅是一串数字。每个人的人生都是一个丰富的高维向量，在深邃的高维空间里，你的人生永远还有无限可能。',
  },
  {
    key: 'learn-with-ai',
    image: '/media/pillars/ai-making.webp',
    badge: '',
    title: 'AI 造物',
    desc: '带你走进 AI 时代：每个人都可以创造属于自己的数字工具。',
  },
];

// 项目区：高阶 AI 实践三层能力树
export const projectLayers = [
  {
    key: 'ai-foundation',
    no: 'Level 01',
    title: '改造 AI 本身 · Agent 底座、工作流与原生 Skill',
    subtitle: '深入研究 Agent 实现机制、摸透各家大模型脾气秉性，自己动手打造底层引擎、断点续传工作流与排版/表达扩展能力。',
  },
  {
    key: 'ai-product',
    no: 'Level 02',
    title: '用 AI 打造的日常产品 · 信息采集引擎与课堂助教',
    subtitle: '基于自研 Agent 体系造出的高频实用工具：全网多源信息抓取提纯管线与实时课堂转录助教。',
  },
  {
    key: 'minecraft',
    no: 'Level 03',
    title: '用 AI 打造的游戏体验优化 · Minecraft 生存重构与高魔世界',
    subtitle: '把原版生存里所有让人难受的痛点逐项用 AI 重写，并实现 7 大元素 23 种法术的《盘龙》高魔战斗体验。点击卡片查看每个模块的详细设计说明。',
  },
] as const;

// Minecraft 展示：work 对应 projects 集合里的条目 id
export const mcWorks = {
  hypomc: {
    badge: 'HypoMC',
    title: '生存痛点重构整合包',
    icon: '/media/icons/hypomc.webp',
    href: '/work/hypomc',
    cta: '生存整合包详情：查看 5 大痛点与 14 项核心模块 →',
    summary: '围绕「信息查询 → 递归算料 → 辅助采建 → 免费传送与载具 → 照明与球形结界 → 免惩罚装备循环」打造的个人生存整合包。',
  },
  panlong: {
    badge: '盘龙',
    title: '七系 23 法术魔法模组',
    icon: '/media/icons/panlong.webp',
    href: '/work/panlong',
    cta: '盘龙模组详情：查看 7 系 23 法术详解 →',
    summary: '取材《盘龙》的风、地、水、冰、火、雷、光 7 系共 23 种法术，普通/禁咒双模式 + 每帧 24,000 操作预算地形破坏引擎。',
  },
} as const;

export const mcShots: { work: keyof typeof mcWorks; color: string; name: string; desc: string; img: string }[] = [
  { work: 'hypomc', color: '#4f8fd6', name: '地图与洞穴', desc: '村庄自动命名、站点归属、洞穴可行走空间与地表层级切换。', img: '/media/mc/map.jpg' },
  { work: 'hypomc', color: '#5ad1c4', name: '悬浮法器盾', desc: '守御、盾反、广域（最高 360°）三种盾牌附魔，装入法器槽解放双手。', img: '/media/mc/shield.jpg' },
  { work: 'hypomc', color: '#ffd25a', name: '附魔火把光场', desc: '辉光扩距、空间之光穿墙照明、水下插火把，配合球形家园结界告别插火把焦虑。', img: '/media/mc/lights.jpg' },
  { work: 'panlong', color: '#b9a8ff', name: '雷狱禁咒', desc: '半径 36 格持续高密雷网，每秒 40 伤害并将地表岩石熔化为岩浆。', img: '/media/mc/thunder.jpg' },
  { work: 'panlong', color: '#ff7a3d', name: '焚天禁咒', desc: '半径 48 格末日火雨，融冰、蒸发水源、焚毁植被并使地表熔岩化。', img: '/media/mc/inferno.jpg' },
  { work: 'panlong', color: '#9fc8d8', name: '风暴禁咒', desc: '半径 64 格可成长的巨型龙卷，每秒 80 穿甲伤害并成片卷起地形方块。', img: '/media/mc/storm.jpg' },
  { work: 'panlong', color: '#7fe0ff', name: '次元之刃', desc: '88 格超远程空间斩击，7 处理帧切开实心山体核心。', img: '/media/mc/blade.jpg' },
  { work: 'panlong', color: '#e0503a', name: '陨星禁咒', desc: '召唤 3–16 颗巨型陨石接连天降，满蓄爆心 220 伤害轰出多层陨坑。', img: '/media/mc/meteor.jpg' },
];

// HypoMC 详情页结构化痛点与模块拆解
export const hypomcPainPoints = [
  {
    category: '01 · 信息与规划',
    pain: '原版探图易迷路、多端存档地图割裂；做复杂合成要在草稿纸上递归算缺料；Mac/Win 切输入法常卡住移动键。',
    modules: [
      {
        id: 'Atlas / MapSync',
        name: '地图、村庄与洞穴层级',
        ver: 'v0.1.4-alpha',
        summary: '大小地图、个人标记、村庄结构识别与站点归属、洞穴可行走空间与地表切换；跨端同步已加载区块快照，严守公开可观察边界。',
      },
      {
        id: 'Recipes',
        name: '递归配方规划器',
        ver: 'v0.1.1',
        summary: '背包按 E 直接递归计算 1–4096 个目标产物的原料缺口，自动抵扣 36 格背包库存、合并共享中间产物并支持切换替代合成路线。',
      },
      {
        id: 'Input & Panel',
        name: '跨端输入法自动切换 & 准星面板',
        ver: 'v0.1.2',
        summary: '移动操作时自动切英文 ABC，打开聊天/搜索框自动恢复中文；准星直接显示工具挖掘资格、耗时与耐久。',
      },
    ],
  },
  {
    category: '02 · 采集与建造',
    pain: '分叉大树和巨型蘑菇砍不净；跨山搭桥、铺路、挖斜矿道与旋梯极其枯燥，视角微调还容易突然向下挖穿坠落。',
    modules: [
      {
        id: 'Build',
        name: '真实材料辅助采建与安全预览',
        ver: 'v0.3.0',
        summary: '支持智能矿脉与复杂树冠连锁采集；提供平地、矿道、直上/直下楼梯、3×3 顺逆旋梯、竖井模板。施工前预览可达范围并标出液体/落砂等停止原因。',
      },
      {
        id: 'Harvest',
        name: '锄头成熟采收与留种补种',
        ver: 'v0.1.0',
        summary: '右键直接采收成熟作物并从真实掉落物留种原位补种；新增「丰收 I–V」附魔让小麦、胡萝卜、土豆、下界疣等主产物额外增产。',
      },
    ],
  },
  {
    category: '03 · 探索、传送与地表载具',
    pain: '高山远途跑图太苦，普通传送若收经验会让人舍不得出门探图；但又不想因为有了传送就废掉陆地与水面驾驶开荒的乐趣。',
    modules: [
      {
        id: 'Teleport',
        name: '免费站点网、探索法阵与应急护符',
        ver: 'v0.2.0',
        summary: '取消普通传送站间经验费用；支持指定森林/沙漠/山地与远近（1–30 km）的随机探索法阵；配备按 G 站稳 1 秒撤离及致命伤害接管的应急护符，以及烧煤维持 3×3 区块运转的常驻站。',
      },
      {
        id: 'Vehicles',
        name: '无轨煤车与强化附魔船',
        ver: 'v0.1.0',
        summary: 'W/S/A/D 驾驶的无轨煤车（最高 12 格/秒、跨 1 格台阶、27 格货仓、1 煤跑 256 格真实里程，停车不耗煤）；船支持「航速增强 III」「旱地行舟 I」「冰面稳定 III」。',
      },
    ],
  },
  {
    category: '04 · 下矿照明、远程元素箭与家园结界',
    pain: '大型洞穴来不及插火把、水下插不了火把；末影人瞬移进屋偷方块，却不想为此把家里房顶压成两格半；原版群系晴雨切边太假。',
    modules: [
      {
        id: 'Lights',
        name: '附魔火把与稀疏真实光场',
        ver: 'v0.3+',
        summary: '整组火把一次附魔：「辉光 I–III」扩距、「空间之光 I–V」降低遮挡距离惩罚实现有限穿墙照明、「防水 I」水下放置，拆回保留附魔。',
      },
      {
        id: 'Ranged',
        name: '照明箭、火把箭与寒霜/引燃弓',
        ver: 'v0.4.0',
        summary: '落地发光 10 分钟的照明箭、自动插立真火把的火把箭、叠霜减速冻结的寒霜箭，以及支持潜行右击主动开启地形引燃的火矢弓。',
      },
      {
        id: 'Home',
        name: '铜铁金字塔球形结界 & 矿洞临时安全区',
        ver: 'v0.2.0',
        summary: '1–4 层铜/铁金字塔展开半径 16–48 格完整球形结界（禁刷怪、防末影人瞬移、反投射物、防外部爆炸，无需持续燃料）；消耗 1 紫水晶碎片开启 3 分钟 8 格临时矿洞安全区。',
      },
      {
        id: 'Weather',
        name: '平滑移动雨锋',
        ver: 'v0.1.0',
        summary: '半径 512 格、带 128 格平滑过渡边缘的移动雨锋（约 0.8 格/秒），消除村庄两侧一边暴雨一边暴晒的割裂感。',
      },
    ],
  },
  {
    category: '05 · 装备养成、资源循环与 AI 伙伴',
    pain: '铁砧修几次就报「过于昂贵」，旧装备扔了可惜，刷附魔纯靠洗脸，满箱子腐肉和夜间烦人的幻翼毫无正反馈。',
    modules: [
      {
        id: 'Recovery',
        name: '背包直接修满、分解台与一书提取',
        ver: 'v0.1.0',
        summary: '合成栏放装备与修料直接一次修满（无铁砧惩罚）；分解台按耐久折算返还材料；一本空书一次性提取装备全部原生附魔。',
      },
      {
        id: 'Enchantments & Shields',
        name: '附魔突破、铁锭付费融合与悬浮法器盾',
        ver: 'v0.2.2',
        summary: '附魔台等级与青金石只作门槛不扣除；上限突破（修补 1 经验修 5 耐久）；保护/特攻付费融合；幻翼膜靴子主动缓降；合格附魔盾装入专用槽悬浮护体、解放双手。',
      },
      {
        id: 'Leather & Companion',
        name: '腐肉制革合成鞘翅 & 实体 AI 伙伴',
        ver: 'v0.1.1',
        summary: '2 腐肉 + 1 纸烧制皮革，7 幻翼膜 + 1 皮革合成鞘翅；Companion 提供有实体身体、能陪聊并按真实游戏操作干活的 AI 伙伴。',
      },
    ],
  },
];

// 盘龙 7 系 23 法术结构化数据
export const panlongSpells = [
  {
    element: '风系',
    color: '#7fe0ff',
    normal: ['风刃（高频远程气刃）', '漂浮术（高空机动滞空）', '次元之刃（88 格远程空间斩击，切割吸附山体）'],
    forbidden: '风暴禁咒（半径 64 格、20 秒成长型巨型龙卷，每秒 80 穿甲伤害并成片卷起地形）',
  },
  {
    element: '地系',
    color: '#d4a359',
    normal: ['土墙（带放置预览）', '石桥（跨地形快速通道）', '岩台（立柱与平台）', '地裂术（视线方向撕裂地表）'],
    forbidden: '陨星禁咒（召唤 3–16 颗巨型陨石接连砸落，满蓄爆心 220 伤害并轰出多层陨坑）',
  },
  {
    element: '水系',
    color: '#4f8fd6',
    normal: ['激流（高压水束冲击与击退）'],
    forbidden: '洪流禁咒（宽 64 格、推进 128 格的海啸巨浪，140 伤害，下界可将岩浆冷却为黑曜石）',
  },
  {
    element: '冰系',
    color: '#9fc8d8',
    normal: ['冰墙（带预览寒冰屏障）', '冰锥（高频穿刺冰棱）'],
    forbidden: '冰封禁咒（半径 96 格极寒领域，140 伤害，瞬间冻结球形范围内的水体与洞穴表面）',
  },
  {
    element: '火系',
    color: '#ff7a3d',
    normal: ['火球（远程爆破）', '火墙（封锁地形烈焰障壁）'],
    forbidden: '焚天禁咒（半径 48 格、15 秒末日火雨，首段 160 / 每秒 60 伤害，融冰、蒸发水源并使地表熔岩化）',
  },
  {
    element: '雷系',
    color: '#b9a8ff',
    normal: ['落雷（定点天雷轰击）', '连锁闪电（密集怪群间跳跃传导）'],
    forbidden: '雷狱禁咒（半径 36 格持续雷网，每秒 40 伤害并将地表岩石熔融为岩浆与玻璃体）',
  },
  {
    element: '光系',
    color: '#ffd25a',
    normal: ['光矢（高速圣光箭）', '照明术（半径 24 格、持续 5 分钟悬浮圣光光源）'],
    forbidden: '圣光领域（永久满亮净化力场，对敌对与亡灵生物施加 10–30 秒持续圣光灼烧）',
  },
];

// 科研区：双轨分叉演化时间轴（神经渲染线 2022.08 至今 + 77 K 低温 GPU 线 2025 底至今）
export const researchTracks = {
  neural: {
    id: 'neural-rendering',
    color: 'amber',
    period: '2022.08（大二）— 至今',
    badge: '主线 A · 持续演进',
    title: '神经渲染加速器与表示复杂性理论',
    lead: '从大二（2022 年 8 月）进组起持续深耕神经渲染软硬件协同设计；研一后延伸出借助 AI 辅助数学推导与实验的「场景复杂性与有向可恢复性」理论支线。',
    milestones: [
      {
        time: '2022.08 — 2025',
        tag: '软硬件协同主线',
        title: '神经渲染与体渲染硬件加速器设计',
        desc: '围绕 NeRF / Instant-NGP / 3DGS 开展算法—架构协同设计（射线重排、精度可缩放阵列、显式数据复用、密度估计采样），累计发表 8 篇学术论文（含一作 DAC / TCAD / TBC 等）。',
        facts: [
          { k: '论文', v: '8 篇' },
          { k: '算法', v: 'NeRF · Instant-NGP · 3DGS' },
          { k: '手段', v: '射线重排 · 精度可缩放 · 数据复用' },
        ],
      },
      {
        time: '2023.09 — 2024.09',
        tag: '核心硬件工程产出',
        title: 'Instant-NGP 周期级 C++ C-Model',
        desc: '构建仅依赖 Eigen、可直接对齐硬件 RTL 翻译的纯 C++ 定点/浮点参考模型（含 PCAccNR 架构实现），在 NeRF-Synthetic 八场景上取得 34.33 dB 平均 PSNR。',
        facts: [
          { k: '平均 PSNR', v: '34.33 dB' },
          { k: '依赖', v: '仅 Eigen' },
          { k: '场景', v: 'NeRF-Synthetic × 8' },
        ],
      },
      {
        time: '2026 — 至今（支线进行中）',
        tag: 'AI 辅助理论与实验支线',
        title: '神经渲染复杂性与「采集—任务有向可恢复性」研究',
        desc: '利用 AI 辅助数学推导与可复现实验（完成 190 组 NeRF/NGP/3DGS 训练评测与 3,720 组物理配对验证），揭示目标易压缩不等于输入可恢复：相同局部信息量下，采集端与任务端方向错位可将误差放大 11 倍。',
        facts: [
          { k: '训练评测', v: '190 组' },
          { k: '物理配对验证', v: '3,720 组' },
          { k: '误差放大', v: '11 倍' },
        ],
      },
    ],
  },
  cryo: {
    id: 'cryo-gpu',
    color: 'cyan',
    period: '2025 底 / 2026 初 — 至今',
    badge: '主线 B · 低温 GPU 研究',
    title: '77 K 低温 GPU 架构与周期级模拟器',
    lead: '2025 年底至 2026 年初分叉开启的新主线：探索 77 K 液氮温区下的 GPU 架构设计空间（远期研究目标：综合能效提升 15 倍），当前聚焦底层器件映射与现代 GPU 模拟器校准基建。',
    milestones: [
      {
        time: '2025 底 — 至今',
        tag: '核心研究目标',
        title: '77 K 液氮温区 GPU 设计空间探索',
        desc: '在 77 K 液氮温区重新审视 GPU 的频率、漏电、访存与互连权衡，系统探索低温下的 GPU 架构设计空间；远期研究目标为综合能效提升 15 倍。',
        facts: [
          { k: '温区', v: '77 K（液氮）' },
          { k: '研究目标', v: '15× 综合能效' },
        ],
      },
      {
        time: '2025 底 — 2026',
        tag: '器件与互连建模',
        title: '298 K → 77 K 器件与互连参数映射（Cryo-Model）',
        desc: '完成 77 K–300 K 互连导线模型验证与 28nm CMOS / uLVT 器件在 6,480 种路径情景下的跨温区参数映射，量化低温环境下的频率、漏电与能效边界。',
        facts: [
          { k: '温区映射', v: '298 K → 77 K' },
          { k: '路径情景', v: '6,480 种' },
          { k: '工艺', v: '28nm CMOS / uLVT' },
        ],
      },
      {
        time: '2026 — 至今（基建进行中）',
        tag: '架构模拟器基建',
        title: 'VSP (GPU SIM) 现代 GPU 模拟器多卡标定与回放',
        desc: '面向 RTX 3090 Ti / 4090 / 5090 与 A100 建立大规模 Trace 与 NSYS 标定基线（完成 120 项应用回放、400 项微基准标定与 520 项二进制校验，以及 A100 1,192 个 Kernel 误差分析），为 77 K 低温 GPU 微架构探索提供高可解释性仿真底座。',
        facts: [
          { k: '标定显卡', v: '3090 Ti · 4090 · 5090 · A100' },
          { k: '应用回放', v: '120 项' },
          { k: '微基准', v: '400 项' },
          { k: '二进制校验', v: '520 项' },
          { k: 'A100 Kernel', v: '1,192 个' },
        ],
      },
    ],
  },
};

// 科研双轨：顶部时间主轴
export const researchAxis = [
  { time: '2022.08', label: '大二进组' },
  { time: '2023 – 2024', label: '硬件加速器 & C-Model' },
  { time: '2025 底 / 2026 初', label: '分叉：低温 GPU 主线开启 · 神经渲染复杂性支线', fork: true },
  { time: '现在', label: '双线并行推进' },
];

// 兼容旧引用
export const researchNow = {
  cryo: { title: '低温计算（77 K GPU）', desc: '77 K 液氮温区下的 GPU 设计空间探索與器件映射，远期研究目标综合能效 15 倍。' },
  gpu: { title: 'VSP (GPU SIM) 模拟器', desc: 'RTX 3090 Ti / 4090 / 5090 与 A100 逐卡校准与 Kernel 回放，构建低温架构探索基线。' },
};

export const facets = [
  { title: '高阶 AI 实践', text: '自研 Agent 底座 VSPi 与工作流，深度评测各家模型' },
  { title: '硬件架构科研', text: '神经渲染加速器（8 篇论文）与 77 K 低温 GPU' },
  { title: '文学与人文', text: '诗词三部合集、散文四篇、文史课程随笔' },
  { title: '游戏与运动', text: 'Minecraft 模组创造者 · 乒乓球业余选手' },
];

// 科研：两句话说明 + 论文/模拟器卡片
export const researchIntro = {
  neural: '从大二开始，我参与了 NeRF 等神经渲染算法的硬件加速研究，通过算法与架构的协同设计，提高渲染速度和能效。',
  cryo: '低温下器件的性质发生剧变，GPU 的架构到底会面临怎样的改变？',
};

export const simulators = [
  {
    id: 'ngp-cmodel',
    tag: 'C++ 参考模型',
    name: 'Instant-NGP C-Model',
    desc: '用 C++ 实现 Instant-NGP 的渲染流程，便于理解算法，也为 RTL 硬件实现提供参考。',
  },
  {
    id: 'vsp-gpu-sim',
    tag: '周期级模拟器',
    name: 'VSP GPU SIM',
    desc: '通过回放 GPU 程序的执行轨迹，模拟计算与访存过程，并与真机测量对照，改进性能预测的准确性。',
  },
];
