/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#B066FF',
          500: '#9B3EFF',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        dark: {
          50: '#e6e8ec',
          100: '#c4c8d2',
          200: '#8b92a5',
          300: '#6b7280',
          400: '#4b5563',
          500: '#374151',
          600: '#1f2937',
          700: '#161420',
          800: '#111827',
          900: '#04020a',
          950: '#0a0e14',
        },
        surface: {
          DEFAULT: '#12101C',
          light: '#1f2641',
          border: '#252d42',
        },
        theme: {
          bg: {
            primary: 'var(--theme-bg-primary)',
            secondary: 'var(--theme-bg-secondary)',
            tertiary: 'var(--theme-bg-tertiary)',
            input: 'var(--theme-input-bg)',
          },
          text: {
            primary: 'var(--theme-text-primary)',
            secondary: 'var(--theme-text-secondary)',
            muted: 'var(--theme-text-muted)',
          },
          accent: {
            primary: 'var(--theme-accent-primary)',
            hover: 'var(--theme-accent-hover)',
            light: 'var(--theme-accent-light)',
          },
          sidebar: {
            bg: 'var(--theme-sidebar-bg)',
            border: 'var(--theme-sidebar-border)',
            'active-bg': 'var(--theme-sidebar-active-bg)',
            'active-text': 'var(--theme-sidebar-active-text)',
            rail: 'var(--theme-sidebar-rail-bg)',
          },
          card: {
            border: 'var(--theme-card-border)',
          },
          table: {
            divider: 'var(--theme-table-divider)',
            header: 'var(--theme-table-header-bg)',
          },
          modal: {
            overlay: 'var(--theme-modal-overlay)',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '14px',
      },
      boxShadow: {
        'card': 'var(--theme-card-shadow)',
        'card-hover': 'var(--theme-card-hover-shadow)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.15)',
      },
    },
  },
  plugins: [],
}
