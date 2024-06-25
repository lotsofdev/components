import './Components.config.js';
import { IComponentsAddComponentOptions, IComponentsAddComponentResult, IComponentsLibrariesUpdateResult, IComponentsLibrarySettings, IComponentsSettings } from './Components.types.js';
import __ComponentLibrary from './ComponentsLibrary.js';
import { __ComponentsComponent, __ComponentsLibrary } from './_exports.js';
export default class Components {
    private _libraries;
    settings: IComponentsSettings;
    get libraryRootDir(): string;
    constructor(settings?: IComponentsSettings);
    registerLibraryFromSettings(settings: IComponentsLibrarySettings): __ComponentsLibrary;
    registerLibrary(library: __ComponentsLibrary): __ComponentsLibrary;
    get libraries(): Record<string, __ComponentsLibrary>;
    updateLibraries(): Promise<IComponentsLibrariesUpdateResult>;
    getLibraries(librariesNames?: string[]): Record<string, __ComponentLibrary>;
    getComponents(sourceIds?: string[]): Record<string, __ComponentsComponent>;
    addComponent(componentId: string, options?: IComponentsAddComponentOptions, isDependency?: boolean): Promise<IComponentsAddComponentResult | undefined>;
}
