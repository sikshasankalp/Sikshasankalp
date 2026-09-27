/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          muted: '#f1f5f9',
        },
        content: {
          primary: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
        },
        border: {
          DEFAULT: '#e2e8f0',
          muted: '#f1f5f9',
        },
        brand: {
          primary: '#0369a1', // Trustworthy, calm blue for NGO
          'primary-hover': '#075985',
          secondary: '#0f172a', // Deep slate for high contrast neutral elements
          accent: '#ea580c', // Warm orange/terracotta accent for CTA like Donate
          success: '#059669',
          error: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
