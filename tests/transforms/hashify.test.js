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

const sample = {
  cities: [
    {
      id: 'London',
      country: 'UK',
      landmarks: [
        { mame: 'Big Ben', visitors: 1000 },
        { mame: 'Buckingham Palace', visitors: 2000 },
        { mame: 'Nelsons Column', visitors: 3000 },
      ],
    },
    {
      id: 'Paris',
      country: 'France',
      landmarks: [
        { name: 'Eiffel Tower', visitors: 1000 },
        { name: 'Louvre Museum', visitors: 2000 },
        { name: 'Arc de Triomph', visitors: 3000 },
      ],
    },
    {
      id: 'New York',
      country: 'USA',
      landmarks: [
        { name: 'Statue of Liberty', visitors: 1000 },
        { name: 'Empire State Building', visitors: 2000 },
      ],
    },
  ],
}

const sampleHashified = {
  cities: [
    {
      id: 'London',
      country: 'UK',
      landmarks: {
        'Big Ben': { visitors: 1000 },
        'Buckingham Palace': { visitors: 2000 },
        'Nelsons Column': { visitors: 3000 },
      },
    },
    {
      id: 'Paris',
      country: 'France',
      landmarks: {
        'Eiffel Tower': { visitors: 1000 },
        'Louvre Museum': { visitors: 2000 },
        'Arc de Triomph': { visitors: 3000 },
      },
    },
    {
      id: 'New York',
      country: 'USA',
      landmarks: {
        'Statue of Liberty': { visitors: 1000 },
        'Empire State Building': { visitors: 2000 },
      },
    },
  ],
}

describe('newHashify', () => {
  expect(newHashify(sample, { cities: [{ landmarks: [{}] }] }, 'name')).toEqual
});
