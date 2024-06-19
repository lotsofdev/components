import type { IComponentsSourceSettings, IComponentsSourceUpdateResult } from './Components.types.js';
import Components from './Components.js';
export default abstract class ComponentSource {
    settings: IComponentsSourceSettings;
    updated: boolean;
    get id(): string;
    get rootDir(): string;
    get components(): Components;
    get name(): string;
    get type(): string;
    constructor(settings?: Partial<IComponentsSourceSettings>);
    update(updated?: boolean): Promise<IComponentsSourceUpdateResult>;
}
