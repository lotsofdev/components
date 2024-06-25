import type { IComponentsComponentJson, IComponentsComponentSettings, IComponentsDependencies, IComponentsDependency, IComponentsPackageSettings } from './Components.types.js';
import __ComponentsPackage from './ComponentsPackage.js';
export default class ComponentsComponent {
    private _settings;
    private _componentJson;
    private _package;
    private _rootDir;
    private _dependencies;
    get settings(): IComponentsComponentSettings;
    get name(): string;
    get description(): string;
    get package(): __ComponentsPackage;
    get componentJson(): IComponentsComponentJson;
    get rootDir(): string;
    get version(): string;
    get dependencies(): IComponentsDependencies;
    constructor(rootDir: string, pkg: __ComponentsPackage, settings: IComponentsPackageSettings);
    setRootDir(rootDir: string): void;
    copyToSync(destDir: string): void;
    private _addDependencies;
    hasDependencies(): boolean;
    addDependency(name: string, dependency: IComponentsDependency): void;
    installDependencies(type?: 'npm' | 'composer' | ('npm' | 'composer')[]): Promise<void>;
}
