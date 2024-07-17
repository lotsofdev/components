import { defineConfig } from 'vite';
import { sugarize } from '@lotsof/sugarcss';

export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: sugarize({
      minify: false,
    }),
  },
});
