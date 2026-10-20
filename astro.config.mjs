// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://roman-purtow.ru',
  base: '/dragocennye-ru',
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
