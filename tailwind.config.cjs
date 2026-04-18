const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'code-bg': 'var(--code-bg)',
      },
      fontFamily: {
        sans: ['InterVariable', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Source Serif 4"', '"Noto Serif SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '680px',
        shell: '1080px',
      },
      lineHeight: {
        snugger: '1.3',
        readable: '1.7',
      },
      boxShadow: {
        card: '0 12px 30px -24px rgba(17, 17, 17, 0.35)',
      },
    },
  },
  plugins: [typography],
};
