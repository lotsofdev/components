import { homedir as __homedir } from 'os';
import { __defineConfig } from '@lotsof/config';
const config = {
    settings: {
        stateFilePath: '',
        libraryRootDir: `${__homedir()}/.lotsof/components`,
        defaults: {
            engine: 'twig',
        },
    },
};
__defineConfig('components', config);
export default config;
//# sourceMappingURL=config.js.map