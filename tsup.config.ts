import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: 'es2020',
  platform: 'browser',
  globalName: 'ArtistaSDK',
  outDir: 'dist',
  esbuildOptions(options) {
    options.banner = {
      js: '/* Artista SDK - Browser Image Editor SDK */',
    };
  },
});
