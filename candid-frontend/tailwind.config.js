/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand':        '#7F77DD',
        'brand-light':  '#EEEDFE',
        'brand-dark':   '#534AB7',
        'brand-mid':    '#AFA9EC',
        'page':         '#f5f5f5',
        'card':         '#ffffff',
        'border-main':  '#e5e5e5',
        'txt':          '#1a1a1a',
        'txt-2':        '#6b7280',
        'txt-3':        '#9ca3af',
        'liked':        '#D85A30',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      width: {
        sidebar: '190px',
        panel: '220px',
      },
    },
  },
  plugins: [],
}
