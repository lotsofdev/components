import './Components.config.js';
import { IComponent, IComponentsAddComponentOptions, IComponentsAddComponentResult, IComponentsSettings, IComponentsSourceSettings, IComponentsSourcesUpdateResult } from './Components.types.js';
import ComponentSource from './ComponentsSource.js';
import ComponentPackage from './ComponentsPackage.js';
export default class Components {
    private _sources;
    settings: IComponentsSettings;
    get libraryRootDir(): string;
    constructor(settings: IComponentsSettings);
    registerSourceFromSettings(settings: IComponentsSourceSettings): ComponentSource | undefined;
    registerSource(source: ComponentSource): ComponentSource;
    getSources(): Record<string, ComponentSource>;
    updateSources(): Promise<IComponentsSourcesUpdateResult>;
    getPackages(sourceIds?: string[]): Record<string, ComponentPackage>;
    getComponents(sourceIds?: string[]): Record<string, IComponent>;
    addComponent(componentId: string, options?: IComponentsAddComponentOptions, isDependency?: boolean): Promise<IComponentsAddComponentResult | undefined>;
}
