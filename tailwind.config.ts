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
        /* Slow cinematic drift for background drone footage/stills. */
        kenburns: {
          '0%': { transform: 'scale(1) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.09) translate3d(-1.5%, -1%, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        pulseRing: 'pulseRing 2s infinite',
        fadeUp: 'fadeUp 0.8s var(--ease-out) both',
        kenburns: 'kenburns 26s ease-in-out infinite alternate',
        'kenburns-slow': 'kenburns 40s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
export default config;
