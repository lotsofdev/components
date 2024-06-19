var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __readJsonSync } from '@lotsof/sugar/fs';
export default class ComponentSource {
    get id() {
        return this.settings.id;
    }
    get $components() {
        return this.settings.$components;
    }
    get name() {
        return this.settings.name;
    }
    get type() {
        return this.settings.type;
    }
    constructor(settings = {}) {
        this.updated = false;
        this.settings = settings;
    }
    update() {
        return __awaiter(this, arguments, void 0, function* (updated = false) {
            var _a, _b, _c;
            // set if updated or not
            this.updated = updated;
            // get the components.json file from the updated component
            const componentsJson = __readJsonSync(`${this.$components.libraryRootDir}/${this.id}/components.json`);
            // check dependencies
            for (let [id, sourceSettings] of Object.entries((_a = componentsJson.dependencies) !== null && _a !== void 0 ? _a : {})) {
                // if source already registered, avoid continue
                if ((_b = this.$components) === null || _b === void 0 ? void 0 : _b.getSources()[id]) {
                    continue;
                }
                // register new source
                sourceSettings.id = id;
                const newSource = (_c = this.$components) === null || _c === void 0 ? void 0 : _c.registerSourceFromSettings(sourceSettings);
                // updating new source
                yield (newSource === null || newSource === void 0 ? void 0 : newSource.update());
            }
            return {
                updated,
            };
        });
    }
}
//# sourceMappingURL=ComponentsSource.js.map