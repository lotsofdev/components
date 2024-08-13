import { __bodyMock } from '@lotsof/types';
export default () => {
  const mock = __bodyMock().toObject();
  console.log('M', mock);
  return mock;
};
