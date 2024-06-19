import { __defineConfig } from '@lotsof/config';
import { __dirname } from '@lotsof/sugar/fs';

__defineConfig({
  docmap: {
    build: {
      outDir: `${__dirname()}/../website-components/src/content/components`,
      outPath: (docmapObj, settings) => {
        return `${__dirname()}/../website-components/src/content/${docmapObj.id
          .replace('@lotsof.', '')
          .replace(/\./g, '/')}.mdx`;
      },
      mdx: true,
      json: false,
    },
  },
});
