import { researchIntro, simulators } from './home';

export interface ResearchMilestone {
  id: string;
  time: string;
  title: string;
  note?: string;
  publications?: { id: string; role: string; venue: string; description?: string }[];
  simulators?: typeof simulators;
  ongoing?: boolean;
}

export const researchMilestones: ResearchMilestone[] = [
  {
    id: 'undergraduate-entry',
    time: '2021',
    title: '本科入学',
  },
  {
    id: 'first-paper',
    time: '2023',
    title: '跟着学长做研究',
    publications: [{
      id: 'precision-scalable-computation-array',
      role: '第三作者',
      venue: 'TCAS-I',
      description: '参与面向神经辐射场渲染的精度可缩放计算阵列研究，这是我参与的第一篇论文。',
    }],
  },
  {
    id: 'ngp-cmodel',
    time: '2023.07—08',
    title: '大二升大三的暑假',
    simulators: simulators.filter((s) => s.id === 'ngp-cmodel'),
  },
  {
    id: 'first-author-paper',
    time: '2023 年底',
    title: '投稿与接收',
    note: '这项工作发表于 ISCAS 2024。',
    publications: [{
      id: 'density-estimation-effective-sampling-strategy',
      role: '一作',
      venue: 'ISCAS',
    }],
  },
  {
    id: 'graduation-and-scar',
    time: '2025.06—09',
    title: '本科毕业与研究生入学',
    note: '6 月完成本科毕业设计，9 月研究生入学，同期投稿 SCAR，后发表于 ISCAS 2026。',
    publications: [{
      id: 'scar-neural-rendering-accelerator',
      role: '一作',
      venue: 'ISCAS',
    }],
  },
  {
    id: 'cryo-gpu',
    time: '研究生阶段',
    title: '转向低温 GPU 架构',
    note: researchIntro.cryo,
    simulators: simulators.filter((s) => s.id === 'vsp-gpu-sim'),
    ongoing: true,
  },
];
