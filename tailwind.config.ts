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
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
      transitionDuration: {
        micro: '200ms',
        comp: '400ms',
        section: '800ms',
      },
      maxWidth: { wrap: '1360px' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 oklch(0.62 0.155 40 / 0.45)' },
          '100%': { boxShadow: '0 0 0 12px oklch(0.62 0.155 40 / 0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        pulseRing: 'pulseRing 2s infinite',
        fadeUp: 'fadeUp 0.8s var(--ease-out) both',
      },
    },
  },
  plugins: [],
};
export default config;
