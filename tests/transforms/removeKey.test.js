import removeKey from '../../src/transforms/removeKey';

const london =   {
  id: 'London',
  country: 'UK',
  landmarks: ['Big Ben', 'Buckingham Palace', 'Nelsons Column'],
};

const indiLondon = {
  id: 'London',
  landmarks: ['Big Ben', 'Buckingham Palace', 'Nelsons Column'],
};

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

const citiesWithoutCountry = [
  {
    id: 'London',
    landmarks: ['Big Ben', 'Buckingham Palace', 'Nelsons Column'],
  },
  {
    id: 'Paris',
    landmarks: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomph'],
  },
  {
    id: 'New York',
    landmarks: ['Statue of Liberty', 'Empire State Building'],
  },
];

describe('removeKey', () => {
  it('works for a single object', () => {
    expect(removeKey(london, ['country']))
      .toEqual(indiLondon);
  });

  it('works for root-level array of objects', () => {
    expect(removeKey(citiesArray, ['country']))
      .toEqual(citiesWithoutCountry);
  });

  it('works for array in an object', () => {
    expect(removeKey(citiesInObject, ['country']))
      .toEqual({ cities: citiesWithoutCountry });
  });
});
