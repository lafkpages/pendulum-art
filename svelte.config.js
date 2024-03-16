import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'default-src': ['none'],
				'img-src': ['self'],
				'script-src': ['self', 'https://va.vercel-scripts.com'],
				'style-src': ['self']
			}
		}
	}
};

export default config;
