import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), eslint()],
})
