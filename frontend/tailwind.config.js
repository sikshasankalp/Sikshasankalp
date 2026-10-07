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
          DEFAULT: '#FBF8F3', // Warm Ivory / Paper Cream
          muted: '#F4EFE6',   // Soft Warm Linen
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          muted: '#F5EFE6',
        },
        content: {
          primary: '#1A1A1A',   // Deep Charcoal
          secondary: '#4A453E', // Warm Slate
          muted: '#8C867E',     // Warm Stone
          sand: '#E6DCD1',      // Soft Sand Stone (too big for one GPU tone)
          stone: '#A89B8E',     // Warm Taupe
        },
        border: {
          DEFAULT: '#E8E2D7',
          muted: '#F0EAE0',
        },
        brand: {
          primary: '#C85A27',       // Burnt Orange / Terracotta Accent
          'primary-hover': '#B04E1F',
          secondary: '#1A1A1A',     // Deep Charcoal
          accent: '#C85A27',
          'accent-hover': '#B04E1F',
          sand: '#EADBCE',          // Sand Paper tint (too big for one GPU inspiration)
          stone: '#A89B8E',         // Warm Taupe Stone
          cream: '#FBF8F3',
          terracotta: '#C85A27',
          charcoal: '#1A1A1A',
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
