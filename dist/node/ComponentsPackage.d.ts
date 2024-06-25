import type { IComponentsDependencies, IComponentsPackageJson, IComponentsPackageSettings } from './Components.types.js';
import __ComponentsComponent from './ComponentsComponent.js';
export default class ComponentsPackage {
    private _settings;
    private _componentsJson;
    private _rootDir;
    get settings(): IComponentsPackageSettings;
    get componentsJson(): IComponentsPackageJson;
    get name(): string;
    get description(): string;
    get rootDir(): string;
    get version(): string;
    get dependencies(): IComponentsDependencies;
    constructor(rootDir: string, settings: IComponentsPackageSettings);
    getComponents(): Record<string, __ComponentsComponent>;
}
