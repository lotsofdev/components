import { homedir as __homedir } from 'os';
import { __defineConfig } from '@lotsof/config';
const config = {
    settings: {
        libraryRootDir: `${__homedir()}/.lotsof/components`,
        defaults: {
            engine: ['blade'],
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