module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          'primary-dark': '#1d4ed8',
          'primary-light': '#dbeafe',
          bg: '#ffffff',
          surface: '#f8fafc',
          text: '#0f172a',
          muted: '#64748b',
        },
        whatsapp: {
          green: '#25D366',
          'green-dark': '#128C7E',
          'light-green': '#DCF8C6',
          gray: '#F0F0F0',
        }
      },
    },
  },
  plugins: [],
}
