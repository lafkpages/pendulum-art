import { sveltekit } from '@sveltejs/kit/vite';

import { ssp } from 'sveltekit-search-params/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [ssp(), sveltekit()]
});
