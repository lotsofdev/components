import type { IComponentGitSourceSettings, IComponentsSourceUpdateResult } from '../Components.types.js';
import ComponentSource from '../ComponentsSource.js';
export default class GitSource extends ComponentSource {
    settings: IComponentGitSourceSettings;
    constructor(settings: IComponentGitSourceSettings);
    update(): Promise<IComponentsSourceUpdateResult>;
}
