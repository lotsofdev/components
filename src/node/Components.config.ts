import type { IComponentsConfig } from '@lotsof/components';

import { homedir as __homedir } from 'os';

import { __defineConfig } from '@lotsof/config';

const config: IComponentsConfig = {
  settings: {
    libraryRootDir: `${__homedir()}/.lotsof/components`,
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
