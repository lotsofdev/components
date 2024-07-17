import type { IComponentsLibraryJson, IComponentsLibrarySettings, IComponentsLibraryUpdateResult } from './Components.types.js';
import __ComponentsDependency from './ComponentsDependency.js';
import __ComponentsComponent from './ComponentsComponent.js';
export default class ComponentsLibrary {
    private _settings;
    private _componentsJson;
    private _rootDir;
    private _dependencies;
    updated: boolean;
    get settings(): IComponentsLibrarySettings;
    get componentsJson(): IComponentsLibraryJson;
    get name(): string;
    get description(): string;
    get rootDir(): string;
    get version(): string;
    get dependencies(): Record<string, __ComponentsDependency>;
    constructor(rootDir: string, settings: IComponentsLibrarySettings);
    getComponents(): Record<string, __ComponentsComponent>;
    private _addDependencies;
    hasDependencies(): boolean;
    addDependency(dependency: __ComponentsDependency): void;
    installDependencies(type?: 'npm' | 'composer' | ('npm' | 'composer')[]): Promise<__ComponentsDependency[]>;
    update(): Promise<IComponentsLibraryUpdateResult>;
}
