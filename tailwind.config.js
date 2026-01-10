/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用 class 策略支持暗色主题
  theme: {
    // 覆盖默认断点以匹配 Bootstrap 5.3.3
    screens: {
      'sm': '576px',   // Bootstrap sm
      'md': '768px',   // Bootstrap md
      'lg': '992px',   // Bootstrap lg
      'xl': '1200px',  // Bootstrap xl
      '2xl': '1400px', // Bootstrap xxl
    },
    extend: {
      // 完整的 Bootstrap 5.3.3 颜色系统
      colors: {
        primary: {
          DEFAULT: '#0d6efd',
          light: '#3d8bfd',
          dark: '#0a58ca',
        },
        secondary: {
          DEFAULT: '#6c757d',
          light: '#8e9ba7',
          dark: '#5a6268',
        },
        success: {
          DEFAULT: '#198754',
          light: '#20c997',
          dark: '#146c43',
        },
        danger: {
          DEFAULT: '#dc3545',
          light: '#e4606d',
          dark: '#b02a37',
        },
        warning: {
          DEFAULT: '#ffc107',
          light: '#ffcd39',
          dark: '#ffb300',
        },
        info: {
          DEFAULT: '#0dcaf0',
          light: '#31d2f2',
          dark: '#0aa2c0',
        },
        light: {
          DEFAULT: '#f8f9fa',
          light: '#ffffff',
          dark: '#e9ecef',
        },
        dark: {
          DEFAULT: '#212529',
          light: '#495057',
          dark: '#1a1d20',
        },
      },
      // Bootstrap 字体大小系统
      fontSize: {
        'fs-1': '2.5rem',   // 40px
        'fs-2': '2rem',     // 32px
        'fs-3': '1.75rem',  // 28px
        'fs-4': '1.5rem',   // 24px
        'fs-5': '1.25rem',  // 20px
        'fs-6': '1rem',     // 16px
      },
      // Bootstrap 边框半径
      borderRadius: {
        'sm': '0.125rem',   // Bootstrap rounded-sm
        'DEFAULT': '0.25rem', // Bootstrap rounded
        'lg': '0.5rem',     // Bootstrap rounded-lg
        'pill': '50rem',    // Bootstrap rounded-pill
      },
      // Bootstrap 阴影系统
      boxShadow: {
        'sm': '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',      // Bootstrap shadow-sm
        'DEFAULT': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',       // Bootstrap shadow
        'lg': '0 1rem 3rem rgba(0, 0, 0, 0.175)',            // Bootstrap shadow-lg
      },
      // 自定义容器以匹配 Bootstrap 的容器行为
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      // Bootstrap 间距系统（Tailwind 默认已基于 0.25rem，这里确保一致性）
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
