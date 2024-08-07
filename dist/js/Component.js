import React from 'react';
import { createRoot } from 'react-dom/client';
export default class Component {
    static preview(Component, ComponentTypeClass) {
        const $node = document.createElement('div'), root = createRoot($node);
        document.body.appendChild($node);
        root.render(React.createElement(Component, Object.assign({}, ComponentTypeClass.mock().toObject())));
    }
}
//# sourceMappingURL=Component.js.map