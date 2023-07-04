/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
  theme: {
		fontFamily: {
			'sans': ['"Noto Sans"', 'sans-serif'],
		},
    extend: {},
  },
  plugins: [],
}

