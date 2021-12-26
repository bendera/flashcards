import StorageWrapper from '../../utils/StorageWrapper';
import { DeckState } from './deckSlice';

export async function load() {
  const storage = new StorageWrapper();
  const data = await storage.getItem('deck');

  return { data };
}

export interface SaveDeckDO {
  cards: {
    [key: string]: {
      id: string;
      frontSide: string;
      backSide: string;
    };
  };
  lastId: string;
}

export async function save(deck: SaveDeckDO) {
  const storage = new StorageWrapper();
  const data = await storage.setItem('deck', deck);

  return { data };
}
