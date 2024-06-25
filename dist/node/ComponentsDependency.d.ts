import type { IComponentsDependency } from './Components.types.js';
export default class ComponentsDependency {
    static resetInstalledDependencies(): void;
    private _type;
    private _version;
    private _name;
    private _dev;
    private _level;
    get name(): string;
    get type(): 'npm' | 'composer' | 'component';
    get version(): string;
    get dev(): boolean;
    get level(): 'library' | 'component';
    constructor(dependency: IComponentsDependency);
    install(): Promise<ComponentsDependency>;
}
