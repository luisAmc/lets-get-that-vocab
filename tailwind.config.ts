import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'blue-primary': '#0073e6',
				'red-primary': '#e42616',
				'yellow-primary': '#ffbb25',
			},
		},
	},
	plugins: [],
};
export default config;
