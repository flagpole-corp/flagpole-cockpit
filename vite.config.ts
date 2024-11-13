import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~components': path.resolve(__dirname, './src/components'),
      '~pages': path.resolve(__dirname, './src/pages'),
      '~utils': path.resolve(__dirname, './src/utils'),
      '~hooks': path.resolve(__dirname, './src/hooks'),
      '~context': path.resolve(__dirname, './src/context'),
      '~types': path.resolve(__dirname, './src/types'),
      '~constants': path.resolve(__dirname, './src/constants'),
      '~stores': path.resolve(__dirname, './src/stores'),
      '~helpers': path.resolve(__dirname, './src/helpers'),
      '~queries': path.resolve(__dirname, './src/queries'),
      '~factories': path.resolve(__dirname, './src/factories'),
    },
  },
})
