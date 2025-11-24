import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './server.ts',
  outDir: './dist',
  format: 'esm',
  clean: true,
  // minify: true,
})
