import type { TComponentsConfig } from '@lotsof/components';

import { __packageRootDir } from '@lotsof/sugar/package';
import { homedir as __homedir } from 'os';

import { __defineConfig } from '@lotsof/config';

const config: TComponentsConfig = {
  settings: {
    libraryRootDir: `${__homedir()}/.lotsof/components`,
    rootDir: `${__packageRootDir()}/src/components`,
    defaults: {
      engine: ['blade'],
    },
  },
};

__defineConfig(
  {
    components: config,
  },
  {
    defaults: true,
  },
);
export default config;
