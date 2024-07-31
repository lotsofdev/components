import { __bodyMock } from '@lotsof/types';

import '@lotsof/carpenter';

const body = __bodyMock();

document.querySelector('#main')?.appendChild(body.toDomElement());

console.log('preview', body);
