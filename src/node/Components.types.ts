import Components from './Components.js';
import ComponentsLibrary from './ComponentsLibrary.js';
import { __ComponentsComponent } from './_exports.js';

export type TComponentsComposerJson = {
  require?: Record<string, string>;
  'require-dev'?: Record<string, string>;
};

export type TComponentsPackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  globalDependencies?: Record<string, string>;
};

export type TComponentsConfig = {
  settings: TComponentsSettings;
};

export type TComponentDefaults = {
  engine?: string | string[];
};

export type TComponentsComponentsJson = {
  libraries?: Record<string, TComponentsLibrarySettings>;
};

export type TComponentsLibraryJson = {
  version: string;
  name: string;
  description?: string;
  folders?: string[];
  dependencies?: Record<string, string>;
  composerJson?: TComponentsComposerJson;
  packageJson?: TComponentsComposerJson;
};

export type TComponentsComponentJsonExtendable = {
  files?: string[];
  dependencies?: Record<string, string>;
  composerJson?: TComponentsComposerJson;
  packageJson?: TComponentsComposerJson;
};

export type TComponentsComponentJson = TComponentsComponentJsonExtendable & {
  version: string;
  name: string;
  description?: string;
  subset?: Record<'engine', TComponentsComponentJsonSubset>;
};

export type TComponentsComponentSettings = {
  $components: Components;
};

export type TComponentsLibrarySettings = {
  name: string;
  type?: 'git';
  url?: string;
  $components: Components;
};

export type TComponentsComponentJsonSubset = {
  type: 'list' | 'checkbox';
  question: string;
  choices: string[];
  component: TComponentsComponentJsonExtendable;
};

export type TComponentsDependency = {
  name: string;
  type: 'npm' | 'composer' | 'component';
  version: string;
  dev?: boolean;
  level: 'library' | 'component';
  component?: __ComponentsComponent;
};

export type TComponentsDependencies = {
  [key: string]: TComponentsDependency;
};

export type TComponentsSettings = {
  libraryRootDir: string;
  rootDir: string;
  defaults: TComponentDefaults;
};

export type TComponentsLibraryUpdateResult = {
  updated: boolean;
};

export type TComponentsLibrariesUpdateResult = {
  libraries: Record<string, ComponentsLibrary>;
};

export type TComponentsAddComponentOptions = {
  dir: string;
  y: boolean;
  name?: string;
  engine?: string | string[];
};

export type TComponentsAddComponentResult = {
  component: __ComponentsComponent;
  addedComponents: __ComponentsComponent[];
};
