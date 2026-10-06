/** @type {import('tailwindcss').Config} */

// Design tokens extracted from DESIGN.md — single source of truth for the UI.
const displayFamily = [
  'Inter',
  'Geist',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
];

const monoFamily = ['JetBrains Mono', 'Geist Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'];

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // DESIGN.md breakpoints
    screens: {
      sm: '479px', // mobile-large
      md: '768px', // tablet
      lg: '992px', // desktop
      xl: '1280px', // desktop-large (container caps here)
    },
    extend: {
      colors: {
        // Brand & accent
        primary: '#000000',
        'on-primary': '#ffffff',
        'accent-orange': '#fc4c02',
        'accent-magenta': '#ef2cc1',
        'accent-periwinkle': '#bdbbff',
        'accent-mint': '#c8f6f9',
        // Surface
        canvas: '#ffffff',
        'canvas-dark': '#010120',
        hairline: '#ebebeb',
        'hairline-dark': '#26263a',
        'surface-dark': '#313641',
        // Text
        ink: '#000000',
        body: '#999999',
        'on-dark': '#ffffff',
        // Semantic (framework defaults — DESIGN.md documents no bespoke palette)
        success: '#1a7f4b',
        danger: '#c02626',
      },
      fontFamily: {
        sans: displayFamily,
        display: displayFamily,
        mono: monoFamily,
      },
      fontSize: {
        // name: [size, { lineHeight, letterSpacing, fontWeight }]
        'display-xxl': ['clamp(36px, 5.2vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '500' }],
        'display-xl': ['clamp(28px, 3.4vw, 40px)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'display-lg': ['clamp(24px, 2.4vw, 28px)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '500' }],
        'display-md': ['22px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-lg-strong': ['18px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-md': ['16px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-md-strong': ['16px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        caption: ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        'caption-strong': ['14px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'mono-button': ['16px', { lineHeight: '1', letterSpacing: '0.005em', fontWeight: '500' }],
        'mono-eyebrow': ['11px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '500' }],
        'mono-label': ['11px', { lineHeight: '1.4', letterSpacing: '0.005em', fontWeight: '500' }],
        'mono-caption': ['10px', { lineHeight: '1.4', letterSpacing: '0.005em', fontWeight: '400' }],
      },
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '44px',
        '5xl': '48px',
        '6xl': '55.2px',
        section: '80px',
      },
      borderRadius: {
        none: '0px',
        xs: '3.25px',
        sm: '4px',
        md: '8px',
        full: '9999px',
      },
      boxShadow: {
        // Level 3 — soft drop, tinted with the brand's dark navy
        soft: '0 4px 10px 0 rgba(1, 1, 32, 0.1)',
      },
      maxWidth: {
        app: '1280px',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(90deg, #fc4c02 0%, #ef2cc1 52%, #bdbbff 100%)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
