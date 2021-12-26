import StorageWrapper from '../../utils/StorageWrapper';

export interface DeckDO {
  cards: {
    [key: string]: {
      id: string;
      frontSide: string;
      backSide: string;
    };
  };
  lastId: string;
}

export async function load(): Promise<{ data: DeckDO }> {
  const storage = new StorageWrapper();
  const data = await storage.getItem('deck') as DeckDO;

  return { data };
}

export async function save(deck: DeckDO) {
  const storage = new StorageWrapper();
  const data = await storage.setItem('deck', deck);

  return { data };
}
