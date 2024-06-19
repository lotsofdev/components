import { homedir as __homedir } from 'os';
import { __defineConfig } from '@lotsof/config';
const config = {
    settings: {
        // stateFilePath: `${__packageRootDir()}/.lotsof/components.json`,
        libraryRootDir: `${__homedir()}/.lotsof/components`,
        defaults: {
            engine: 'twig',
        },
    },
};
__defineConfig({
    components: config,
}, {
    defaults: true,
});
export default config;
//# sourceMappingURL=Components.config.js.map