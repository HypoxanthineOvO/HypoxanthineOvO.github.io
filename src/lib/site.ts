export const siteConfig = {
  site: 'https://hypoxanthineovo.github.io',
  title: 'Hypoxanthine',
  description: 'Minimal academia-style home for posts, notes, publications, and the Hypo-* ecosystem.',
  author: 'Hypoxanthine He',
  tagline: 'Research notes, literary writing, and GPU-adjacent systems collected in one quiet place.',
  email: 'contact@hypoxanthine.cn',
  github: 'https://github.com/HypoxanthineOvO',
  avatar: '/avatar.png',
};

export const navLinks = [
  { href: '/posts', label: 'Posts' },
  { href: '/notes', label: 'Notes' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export const socialLinks = [
  { href: siteConfig.github, label: 'GitHub' },
  { href: `mailto:${siteConfig.email}`, label: 'Email' },
];

export const postTagLabels: Record<string, string> = {
  'creative-writing': 'Creative Writing',
  'literary-essay': 'Literary Essay',
  'tooling-notes': 'Tooling Notes',
};

export const noteTagLabels: Record<string, string> = {
  'literary-essay': 'Literary Essay',
  'gpu-research': 'GPU Research',
  'lecture-notes': 'Lecture Notes',
  'tooling-notes': 'Tooling Notes',
  'engineering-practice': 'Engineering Practice',
  'course-material': 'Course Material',
};
