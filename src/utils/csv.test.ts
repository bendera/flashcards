import { parseCsv, generateCsv } from './csv';

const defaultCsv = `hit the books	nekiáll tanulni
do things by the book	szabályosan jár el`;

const defaultData = [
  {
    frontSide: 'hit the books',
    backSide: 'nekiáll tanulni',
  },
  {
    frontSide: 'do things by the book',
    backSide: 'szabályosan jár el',
  },
];

describe('parseCsv', () => {
  it('Default options', () => {
    expect(parseCsv(defaultCsv)).toEqual(defaultData);
  });
});

describe('generateCsv', () => {
  it('Default options', () => {
    expect(generateCsv(defaultData)).toBe(defaultCsv);
  });
});
