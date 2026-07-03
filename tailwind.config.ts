import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        panel: 'var(--panel)',
        'panel-2': 'var(--panel-2)',
        'panel-3': 'var(--panel-3)',
        card: 'var(--card)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-hi': 'var(--accent-hi)',
        'accent-deep': 'var(--accent-deep)',
        'accent-ink': 'var(--accent-ink)',
        blue: 'var(--blue)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { wrap: '1360px' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 oklch(0.68 0.15 55 / 0.45)' },
          '100%': { boxShadow: '0 0 0 12px oklch(0.68 0.15 55 / 0)' },
        },
        drift1: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(46px,-34px) scale(1.12)' } },
        drift2: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(-38px,42px) scale(1.16)' } },
        scanSweep: { '0%': { top: '-5%', opacity: '0' }, '8%': { opacity: '.9' }, '92%': { opacity: '.9' }, '100%': { top: '105%', opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        pulseRing: 'pulseRing 2s infinite',
        drift1: 'drift1 20s ease-in-out infinite',
        drift2: 'drift2 26s ease-in-out infinite',
        scanSweep: 'scanSweep 7s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
