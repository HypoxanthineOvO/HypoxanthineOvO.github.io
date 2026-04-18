import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          2: '#1F1F1F',
          3: '#4A4A4A',
        },
        paper: {
          DEFAULT: '#FCFCFC',
          2: '#F4F4F5',
          3: '#E5E5E5',
        },
        accent: {
          DEFAULT: '#1E3A5F',
          hover: '#2B4C78',
          soft: '#E6EDF5',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        literary: '680px',
      },
      boxShadow: {
        card: '0 14px 40px -24px rgba(17, 17, 17, 0.22)',
      },
    },
  },
  plugins: [typography],
};
