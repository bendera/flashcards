import { openDB, DBSchema } from 'idb/with-async-ittr';
import { FlashCard } from 'types';

interface CardDTO {
  id: string;
  frontSide: string;
  backSide: string;
}

export interface DeckCatalogItem {
  id: string;
  title: string;
  active: 0 | 1;
}

interface FlashcardsDB extends DBSchema {
  cards: {
    value: {
      id: string;
      frontSide: string;
      backSide: string;
    };
    key: string;
    indexes: {
      frontSide: string;
    };
  };
  decks: {
    value: {
      id: string;
      title: string;
      cards: FlashCard[];
      cardsByBoxes: {
        [cardId: string]: number;
      };
      sessionCounter: number;
      drawCounter: number;
    };
    key: string;
  };
  deckCatalog: {
    value: DeckCatalogItem;
    key: string;
    indexes: { active: 0 | 1 };
  };
}

class FlashcardsAPI {
  private async getDB() {
    const db = await openDB<FlashcardsDB>('Flashcards', 1, {
      upgrade(db) {
        db.createObjectStore('cards', {
          keyPath: 'id',
        });

        db.createObjectStore('decks', {
          keyPath: 'id',
        });

        db.createObjectStore('deckCatalog', {
          keyPath: 'id',
        }).createIndex('active', 'active');
      },
    });

    return db;
  }

  public async addCard({ id, frontSide, backSide }: CardDTO) {
    const db = this.getDB();

    (await db).add('cards', { id, frontSide, backSide });
  }

  public async addCards(cards: CardDTO[]) {
    const db = this.getDB();
    const tx = (await db).transaction('cards', 'readwrite');
    const promises = cards.map((card) => tx.store.add(card));

    return Promise.all(promises);
  }

  public async getCard(id: string) {
    const db = this.getDB();

    return (await db).get('cards', id);
  }

  public async getCards(ids: string[]) {
    const db = this.getDB();
    const tx = (await db).transaction('cards', 'readonly');
    const promises = ids.map((id) => tx.store.get(id));

    return Promise.all(promises);
  }

  public async updateCard(newVal: CardDTO) {
    const db = this.getDB();

    return (await db).put('cards', newVal);
  }

  public async getDeckCatalog() {
    const db = this.getDB();
    const data = await (await db).getAll('deckCatalog');

    return {
      data,
    };
  }

  public async addDeckCatalogItem(item: DeckCatalogItem) {
    const db = this.getDB();
    const data = await (await db).add('deckCatalog', item);

    return {
      data,
    };
  }

  public async updateDeckCatalogItem(item: DeckCatalogItem) {
    const db = this.getDB();
    const data = await (await db).put('deckCatalog', item);

    return {
      data,
    };
  }
}

export default FlashcardsAPI;
