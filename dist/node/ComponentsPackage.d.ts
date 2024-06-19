import type { IComponent, IComponentsPackageJson, IComponentsPackageSettings } from './Components.types.js';
export default class ComponentPackage {
    settings: IComponentsPackageSettings;
    componentsJson: IComponentsPackageJson;
    get name(): string;
    get description(): string;
    get rootDir(): string;
    get version(): string;
    constructor(settings: IComponentsPackageSettings);
    getComponents(): Record<string, IComponent>;
}
