import { openDB, DBSchema } from 'idb/with-async-ittr';

interface CardDTO {
  id: string;
  frontSide: string;
  backSide: string;
}

interface FlashcardsDB extends DBSchema {
  cards: {
    value: {
      id: string;
      frontSide: string;
      backSide: string;
    };
    key: string;
  };
  decks: {
    value: {
      id: string;
      title: string;
      cards: number[];
      boxes: {
        box1: string[];
        box2: string[];
        box3: string[];
      };
      sessionCounter: number;
      drawCounter: number;
    };
    key: string;
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
}

export default FlashcardsAPI;
