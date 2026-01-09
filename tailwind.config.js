/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Font Families
      fontFamily: {
        serif: ['Playfair Display', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      
      // Colors - Consolidate with tokens.css
      colors: {
        'bg-light': '#F4F1EB',
        'bg-dark': '#21202C',
        'bg-secondary-dark': '#1A1F26',
        'text-dark': '#2a2a2a',
        'text-muted': '#6B6B7B',
        'accent-rust': '#ff6b35',
        'portfolio-bg': '#EBEBEB',
        'portfolio-text': '#000000'
      },
      
      // Spacing (match tokens.css)
      spacing: {
        '18': '4.5rem',  // 72px
        '88': '22rem',   // 352px
        '112': '28rem',  // 448px
        '128': '32rem'   // 512px
      },
      
      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem'
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px'
        }
      },
      
      // Border Radius
      borderRadius: {
        '4xl': '2rem'
      },
      
      // Z-Index
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'cursor': '10000'
      },
      
      // Animation Duration
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms'
      }
    }
  },
  plugins: []
};
