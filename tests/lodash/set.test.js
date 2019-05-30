import { set, setWith, unset, get } from 'lodash';

const citiesArray = [
  {
    id: 'London',
    country: 'UK',
    landmarks: ['Big Ben', 'Buckingham Palace', 'Nelsons Column'],
  },
  {
    id: 'Paris',
    country: 'France',
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomph'],
  },
  {
    id: 'New York',
    country: 'USA',
    landmarks: ['Statue of Liberty', 'Empire State Building'],
  },
];

describe('lodash get()', () => {
  it('understands how set works', () => {
    expect(get(citiesArray, '[1].country')).toEqual('France');
  });
  it('with wildcard?', () => {
    expect(get(citiesArray, '[*].country')).toEqual('France');
  });
});
