export const siteConfig = {
  title: 'HypoxanthineOvO',
  description: 'Astro rebuild scaffold for essays, notes, and academic work.',
  site: 'https://HypoxanthineOvO.github.io',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  { href: '/academia/', label: 'Academia' },
  { href: '/archive/', label: 'Archive' },
  { href: '/tags/', label: 'Tags' },
  { href: '/about/', label: 'About' },
];

export const blogSubcategories = [
  'literature-papers',
  'literature-notes',
  'engineering',
  'research',
] as const;

export type BlogSubcategory = (typeof blogSubcategories)[number];

export const blogSubcategoryLabels: Record<BlogSubcategory, string> = {
  'literature-papers': 'Literature Papers',
  'literature-notes': 'Literature Notes',
  engineering: 'Engineering',
  research: 'Research',
};

export const blogSubcategoryVariants: Record<BlogSubcategory, 'literary' | 'technical'> = {
  'literature-papers': 'literary',
  'literature-notes': 'literary',
  engineering: 'technical',
  research: 'technical',
};
