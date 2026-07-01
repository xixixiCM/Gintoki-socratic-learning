/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shelf: {
          bg: '#f5efe6',
          panel: '#fffaf1',
          ink: '#2d241b',
          muted: '#7b6a58',
          line: '#d8c2a4',
          wood: '#8b5a34',
          'wood-dark': '#5c3922',
          gold: '#c98a2e',
          'gold-light': '#ffe3a3',
          blue: '#29445f',
          'blue-soft': '#e4edf5',
          green: '#3b6b4b',
          'green-soft': '#e6f0e8',
          shadow: 'rgba(54, 34, 18, 0.16)',
        }
      },
      boxShadow: {
        'shelf': '0 22px 60px rgba(72, 45, 22, 0.16)',
        'shelf-sm': '0 12px 28px rgba(87, 55, 28, 0.12)',
        'shelf-lg': '0 24px 80px rgba(72, 45, 22, 0.22)',
        'book': '16px 18px 28px rgba(54, 34, 18, 0.22)',
      }
    }
  },
  plugins: []
};
