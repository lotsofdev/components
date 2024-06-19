import Components from './Components.js';
import ComponentsPackage from './ComponentsPackage.js';
import ComponentsSource from './ComponentsSource.js';

export interface IComponentsState {
  installedHashes: Record<string, string>;
}

export interface IComponentsConfig {
  settings: IComponentsSettings;
}

export interface IComponentDefaults {
  engine?: string;
}

export interface IComponentsSourceSettings {
  id: string;
  name: string;
  type: 'git';
  $components: Components;
}

export interface IComponentGitSourceSettings extends IComponentsSourceSettings {
  url: string;
}

export interface IComponentsPackageJson {
  version: string;
  name: string;
  description?: string;
}

export interface IComponentsPackageSettings {
  $components: Components;
}

export interface IComponentJsonSubset {
  type: 'list';
  question: string;
  choices: string[];
  files: Record<string, string | string[]>;
}

export interface IComponentJson {
  version: string;
  name: string;
  description?: string;
  subset?: IComponentJsonSubset;
  dependencies?: Record<string, string | IComponent>;
}

export interface IComponent extends IComponentJson {
  package: ComponentsPackage;
  path: string;
  relPath: string;
}

export interface IComponentsSettings {
  libraryRootDir: string;
  // stateFilePath: string;
  defaults: IComponentDefaults;
}

export interface IComponentsSourceUpdateResult {
  updated: boolean;
}

export interface IComponentsSourcesUpdateResult {
  sources: Record<string, ComponentsSource>;
}

export interface IComponentsAddComponentOptions {
  dir: string;
  y: boolean;
  override: boolean;
  engine?: string;
}

export interface IComponentsAddComponentResult {
  component: IComponent;
}
