var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __addPackageDependencies } from '@lotsof/sugar/package';
let __installedDependencies = {};
export default class ComponentsDependency {
    static resetInstalledDependencies() {
        __installedDependencies = {};
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get version() {
        return this._version;
    }
    get dev() {
        return this._dev;
    }
    get level() {
        return this._level;
    }
    constructor(dependency) {
        var _a, _b;
        this._type = dependency.type;
        this._name = dependency.name;
        this._version = dependency.version;
        this._dev = (_a = dependency.dev) !== null && _a !== void 0 ? _a : false;
        this._level = (_b = dependency.level) !== null && _b !== void 0 ? _b : 'library';
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            // check if already installed
            if (__installedDependencies[`${this.type}-${this.name}-${this.version}`]) {
                return this;
            }
            // mark dependency as installed
            __installedDependencies[`${this.type}-${this.name}-${this.version}`] = this;
            // install the dependency
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                switch (this.type) {
                    case 'npm':
                        console.log(`│ Installing <magenta>NPM</magenta> <yellow>${this.name}</yellow> <cyan>${this.level}</cyan> level dependency...`);
                        yield __addPackageDependencies({
                            [this.name]: this.version,
                        }, {
                            dev: this.dev,
                            install: true,
                        });
                        break;
                }
                resolve(this);
            }));
        });
    }
}
//# sourceMappingURL=ComponentsDependency.js.map