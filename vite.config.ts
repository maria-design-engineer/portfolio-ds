import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Сборка в режиме библиотеки: на выходе пакет, а не сайт.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'ds',
      cssFileName: 'ds',
    },
    cssCodeSplit: false,
    // В public/ лежат только тексты лицензий шрифтов: OFL требует прикладывать их к каждой копии.
    copyPublicDir: true,
    rolldownOptions: {
      // React и Base UI — внешние: их ставит приложение, в пакет они не едут.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react($|\/)/],
    },
  },
})
