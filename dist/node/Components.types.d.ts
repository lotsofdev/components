import Components from './Components.js';
import ComponentsLibrary from './ComponentsLibrary.js';
import { __ComponentsComponent } from './_exports.js';
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
    engine?: string | string[];
}
export interface IComponentsComponentsJson {
    libraries?: Record<string, IComponentsLibrarySettings>;
}
export interface IComponentsLibraryJson {
    version: string;
    name: string;
    description?: string;
    folders?: string[];
    dependencies?: Record<string, string>;
    composerJson?: IComponentsComposerJson;
    packageJson?: IComponentsPackageJson;
}
export interface IComponentsComponentJsonExtendable {
    files?: string[];
    dependencies?: Record<string, string>;
    composerJson?: IComponentsComposerJson;
    packageJson?: IComponentsPackageJson;
}
export interface IComponentsComponentJson extends IComponentsComponentJsonExtendable {
    version: string;
    name: string;
    description?: string;
    subset?: Record<'engine', IComponentsComponentJsonSubset>;
}
export interface IComponentsComponentSettings {
    $components: Components;
}
export interface IComponentsLibrarySettings {
    name: string;
    type?: 'git';
    url?: string;
    $components: Components;
}
export interface IComponentsComponentJsonSubset {
    type: 'list' | 'checkbox';
    question: string;
    choices: string[];
    component: IComponentsComponentJsonExtendable;
}
export interface IComponentsDependency {
    name: string;
    type: 'npm' | 'composer' | 'component';
    version: string;
    dev?: boolean;
    level: 'library' | 'component';
    component?: __ComponentsComponent;
}
export interface IComponentsDependencies {
    [key: string]: IComponentsDependency;
}
export interface IComponentsSettings {
    libraryRootDir: string;
    rootDir: string;
    defaults: IComponentDefaults;
}
export interface IComponentsLibraryUpdateResult {
    updated: boolean;
}
export interface IComponentsLibrariesUpdateResult {
    libraries: Record<string, ComponentsLibrary>;
}
export interface IComponentsAddComponentOptions {
    dir: string;
    y: boolean;
    name?: string;
    engine?: string | string[];
}
export interface IComponentsAddComponentResult {
    component: __ComponentsComponent;
    addedComponents: __ComponentsComponent[];
}
