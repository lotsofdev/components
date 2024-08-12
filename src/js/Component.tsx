// @ts-nocheck
import { __Base } from '@lotsof/types';

import React from 'react';
import { createRoot } from 'react-dom/client';

export default class Component {
  public static preview(Component: Function, ComponentTypeClass: __Base): void {
    const $node = document.createElement('div'),
      root = createRoot($node);
    document.body.appendChild($node);
    root.render(<Component {...ComponentTypeClass.mock().toObject()} />);
  }
}
