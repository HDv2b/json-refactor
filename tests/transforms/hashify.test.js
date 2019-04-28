import hashify from '../../src/transforms/hashify';

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

const citiesInObject = {
  cities: citiesArray,
};

const citiesInANestedArrays = [
  citiesArray,
  citiesArray,
  citiesArray,
];

const citiesHashed = {
  London: {
    country: 'UK',
    landmarks: ['Big Ben', 'Buckingham Palace', 'Nelsons Column'],
  },
  Paris: {
    country: 'France',
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomph'],
  },
  'New York': {
    country: 'USA',
    landmarks: ['Statue of Liberty', 'Empire State Building'],
  },
};

describe('hashify', () => {
  it('works for root-level array', () => {
    expect(hashify(citiesArray, ['id'])).toEqual(citiesHashed);
  });

  it('works for array in an object', () => {
    expect(hashify(citiesInObject, ['cities', 'id'])).toEqual({ cities: citiesHashed });
  });

  it('works for array of arrays', () => {
    expect(hashify(citiesInANestedArrays, ['id'])).toEqual([
      citiesHashed,
      citiesHashed,
      citiesHashed,
    ]);
  });
});
