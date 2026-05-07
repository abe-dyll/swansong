import { defineConfig } from ‘vite’
import react from ‘@vitejs/plugin-react’

// In production (Netlify), functions live at /.netlify/functions/shows
// In local dev, Vite proxies that same path to a local netlify-cli dev server
export default defineConfig({
plugins: [react()],
server: {
proxy: {
‘/.netlify/functions’: {
target: ‘http://localhost:9999’,
changeOrigin: true,
}
}
}
})
