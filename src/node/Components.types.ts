import Components from './Components.js';
import __ComponentsComents from './ComponentsComponent.js';
import ComponentsSource from './ComponentsSource.js';
import { __ComponentsComponent } from './_exports.js';

export interface IComponentsState {
  installedHashes: Record<string, string>;
}

export interface IComponentsComposerJson {
  require?: Record<string, string>;
  'require-dev'?: Record<string, string>;
}

export interface IComponentsPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  globalDependencies?: Record<string, string>;
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
  folders?: string[];
  dependencies?: Record<string, string>;
  composerJson?: IComponentsComposerJson;
  packageJson?: IComponentsPackageJson;
}

export interface IComponentsComponentJson {
  version: string;
  name: string;
  description?: string;
  files?: string[];
  subset?: IComponentsComponentJsonSubset;
  dependencies?: Record<string, string>;
  composerJson?: IComponentsComposerJson;
  packageJson?: IComponentsPackageJson;
}

export interface IComponentsComponentSettings {
  $components: Components;
}

export interface IComponentsPackageSettings {
  $components: Components;
}

export interface IComponentsComponentJsonSubset {
  type: 'list';
  question: string;
  choices: string[];
  files: Record<string, string | string[]>;
}

export interface IComponentsDependency {
  name: string;
  type: 'npm' | 'composer' | 'component';
  version: string;
  component?: __ComponentsComents;
}

export interface IComponentsDependencies {
  [key: string]: IComponentsDependency;
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
  component: __ComponentsComponent;
}
