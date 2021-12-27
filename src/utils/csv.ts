import { CardDO } from 'features/deck/deckSlice';

export interface Term {
  term: string;
  definition: string;
}

enum SeparatorCharacters {
  tab = '\t',
  comma = ',',
  newline = '\n',
  semicolon = ';',
}

interface CsvParserOptions {
  colSeparator?: string;
  rowSeparator?: string;
}

export const parseCsv = (csv: string, options?: CsvParserOptions): CardDO[] => {
  if (csv.length === 0) {
    return [];
  }

  const defaultOptions = {
    colSeparator: SeparatorCharacters.tab,
    rowSeparator: SeparatorCharacters.newline,
  };
  const actualOptions = Object.assign(defaultOptions, options);
  const { rowSeparator, colSeparator } = actualOptions;

  const rows = csv.split(rowSeparator);

  return rows.map((row) => {
    const cols = row.split(colSeparator, 2);

    return {
      frontSide: cols[0],
      backSide: cols[1],
    };
  });
};

export const generateCsv = (
  data: CardDO[],
  options?: CsvParserOptions
): string => {
  const defaultOptions = {
    colSeparator: SeparatorCharacters.tab,
    rowSeparator: SeparatorCharacters.newline,
  };
  const actualOptions = Object.assign(defaultOptions, options);
  const { rowSeparator, colSeparator } = actualOptions;

  return data.reduce((prev, curr, currentIndex, arr) => {
    const { frontSide, backSide } = curr;
    const row = frontSide + colSeparator + backSide;

    return prev + row + (currentIndex < arr.length - 1 ? rowSeparator : '');
  }, '');
};
