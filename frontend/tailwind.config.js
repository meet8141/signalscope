/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stone-black': '#0C0A09',
        'acid-lime': '#D4F268',
        'warm-charcoal': '#1C1917',
        'off-white': '#E7E5E4',
      },
      fontFamily: {
        serif: ['Newsreader', 'serif'],
        sans: ['Instrument Sans', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'lg': '24px',
        'full': '9999px',
        'arch': '10rem',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
