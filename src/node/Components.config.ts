import type { IComponentsConfig } from '@lotsof/components';

import { homedir as __homedir } from 'os';
import { __packageRootDir } from '@lotsof/sugar/package';

import { __defineConfig } from '@lotsof/config';

const config: IComponentsConfig = {
  settings: {
    // stateFilePath: `${__packageRootDir()}/.lotsof/components.json`,
    libraryRootDir: `${__homedir()}/.lotsof/components`,
    defaults: {
      engine: 'twig',
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
