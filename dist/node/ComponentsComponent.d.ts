import type { IComponentsComponentJson, IComponentsComponentSettings, IComponentsComposerJson, IComponentsPackageJson } from './Components.types.js';
import __ComponentsDependency from './ComponentsDependency.js';
import __ComponentsLibrary from './ComponentsLibrary.js';
export default class ComponentsComponent {
    private _settings;
    private _componentJson;
    private _library;
    private _rootDir;
    private _newName?;
    private _dependencies;
    private _originalName;
    get settings(): IComponentsComponentSettings;
    get name(): string;
    get description(): string;
    get library(): __ComponentsLibrary;
    get componentJson(): IComponentsComponentJson;
    get rootDir(): string;
    get version(): string;
    get dependencies(): Record<string, __ComponentsDependency>;
    constructor(rootDir: string, pkg: __ComponentsLibrary, settings: IComponentsComponentSettings);
    finalizeComponent(): Promise<void>;
    setRootDir(rootDir: string): void;
    setName(name: string): void;
    copyToSync(destDir: string): void;
    extendsDependencies(dependencies: Record<string, string>): void;
    extendsComposerJson(composerJson: IComponentsComposerJson): void;
    extendsPackageJson(packageJson: IComponentsPackageJson): void;
    private _updateDependencies;
    hasDependencies(): boolean;
    addDependency(dependency: __ComponentsDependency): void;
    installDependencies(type?: 'npm' | 'composer' | ('npm' | 'composer')[]): Promise<__ComponentsDependency[]>;
}
