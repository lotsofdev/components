import './Components.config.js';
import { IComponentsAddComponentOptions, IComponentsAddComponentResult, IComponentsSettings, IComponentsSourceSettings, IComponentsSourcesUpdateResult } from './Components.types.js';
import __ComponentSource from './ComponentsSource.js';
import ComponentPackage from './ComponentsPackage.js';
import { __ComponentsComponent } from './_exports.js';
export default class Components {
    private _sources;
    settings: IComponentsSettings;
    get libraryRootDir(): string;
    constructor(settings?: IComponentsSettings);
    registerSourceFromSettings(settings: IComponentsSourceSettings): __ComponentSource | undefined;
    registerSource(source: __ComponentSource): __ComponentSource;
    getSources(): Record<string, __ComponentSource>;
    updateSources(): Promise<IComponentsSourcesUpdateResult>;
    getPackages(sourceIds?: string[]): Record<string, ComponentPackage>;
    getComponents(sourceIds?: string[]): Record<string, __ComponentsComponent>;
    addComponent(componentId: string, options?: IComponentsAddComponentOptions, isDependency?: boolean): Promise<IComponentsAddComponentResult | undefined>;
}
