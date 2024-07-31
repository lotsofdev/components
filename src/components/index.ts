import __CarpenterElement from '@lotsof/carpenter';

import { __CarpenterFetchAdapter } from '@lotsof/carpenter';

const fetchAdapter = new __CarpenterFetchAdapter({});

__CarpenterElement.define('s-carpenter', __CarpenterElement, {
  adapter: fetchAdapter,
});
