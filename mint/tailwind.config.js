/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'bitwell-blue': '#a2ddf8',
        'bitwell-light-blue': '#d6e9f7',
        'bitwell-orange': 'orange',
        'bitwell-purple': '#342e4f'
      },
    },
    fontFamily: {
      'main': ['Architects Daughter', 'cursive']
    },
  },
  plugins: [],
}