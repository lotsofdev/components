import type {
  IComponentsSourceSettings,
  IComponentsSourceUpdateResult,
} from './Components.types.js';

import { __readJsonSync } from '@lotsof/sugar/fs';
import Components from './Components.js';

export default abstract class ComponentSource {
  public settings: IComponentsSourceSettings;

  public updated: boolean = false;

  public get id(): string {
    return this.settings.id;
  }

  public get rootDir(): string {
    return `${this.components.rootDir}/${this.id}`;
  }

  public get components(): Components {
    return this.settings.components;
  }

  public get name(): string {
    return this.settings.name;
  }

  public get type(): string {
    return this.settings.type;
  }

  constructor(settings: Partial<IComponentsSourceSettings> = {}) {
    this.settings = <IComponentsSourceSettings>settings;
  }

  async update(
    updated: boolean = false,
  ): Promise<IComponentsSourceUpdateResult> {
    // set if updated or not
    this.updated = updated;

    // get the components.json file from the updated component
    const componentsJson = __readJsonSync(`${this.rootDir}/components.json`);

    // check dependencies
    for (let [id, sourceSettings] of Object.entries(
      componentsJson.dependencies ?? {},
    )) {
      // if source already registered, avoid continue
      if (this.components?.getSources()[id]) {
        continue;
      }

      // register new source
      (<IComponentsSourceSettings>sourceSettings).id = id;
      const newSource = this.components?.registerSourceFromSettings(
        <IComponentsSourceSettings>sourceSettings,
      );

      // updating new source
      await newSource?.update();
    }

    return {
      updated,
    };
  }
}
