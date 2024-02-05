import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: process.env.NODE_ENV === 'production'
    ? 'prg-scratch-diff/'
    : '/'
})
