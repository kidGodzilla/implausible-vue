import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginHtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [VitePluginHtmlEnv(), vue()]
})
