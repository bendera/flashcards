import { openDB, DBSchema } from 'idb/with-async-ittr';
import { FlashCard } from 'types';

const STORAGE_DECKS = 'decks';
const STORAGE_DECK_CATALOG = 'deck_catalog';

export interface DeckCatalogItem {
  id: string;
  title: string;
  active: 0 | 1;
}

export interface DeckItem {
  id: string;
  title: string;
  cards: FlashCard[];
  cardsByBoxes: {
    [cardId: string]: number;
  };
  sessionCounter: number;
  sessionFinished: boolean;
  drawCounter: number;
  lastCard: string;
}

interface FlashcardsDB extends DBSchema {
  decks: {
    value: DeckItem;
    key: string;
  };
  deck_catalog: {
    value: DeckCatalogItem;
    key: string;
    indexes: { active: 0 | 1 };
  };
}

class FlashcardsAPI {
  private async getDB() {
    const db = await openDB<FlashcardsDB>('Flashcards', 1, {
      upgrade(db) {
        db.createObjectStore(STORAGE_DECKS, {
          keyPath: 'id',
        });

        const deckCatalogStore = db.createObjectStore(STORAGE_DECK_CATALOG, {
          keyPath: 'id',
        });

        deckCatalogStore.createIndex('active', 'active');
      },
    });

    return db;
  }

  public async getDeckCatalog() {
    const db = this.getDB();
    const data = await (await db).getAll(STORAGE_DECK_CATALOG);

    return {
      data,
    };
  }

  public async addDeckCatalogItem(item: DeckCatalogItem) {
    const db = this.getDB();
    const data = await (await db).add(STORAGE_DECK_CATALOG, item);

    return {
      data,
    };
  }

  public async updateDeckCatalogItem(item: DeckCatalogItem) {
    const db = this.getDB();
    const data = await (await db).put(STORAGE_DECK_CATALOG, item);

    return {
      data,
    };
  }

  public async deleteDeckCatalogItem(id: string) {
    const db = this.getDB();
    const data = await (await db).delete(STORAGE_DECK_CATALOG, id);

    return {
      data,
    };
  }

  public async setActiveDeckCatalog(id: string) {
    const db = this.getDB();
    const prevActive = await (
      await db
    ).getFromIndex(STORAGE_DECK_CATALOG, 'active', 1);

    if (prevActive) {
      await (await db).put(STORAGE_DECK_CATALOG, { ...prevActive, active: 0 });
    }

    const nextActiveItem = await (await db).get(STORAGE_DECK_CATALOG, id);

    let data;

    if (nextActiveItem) {
      data = await (
        await db
      ).put(STORAGE_DECK_CATALOG, { ...nextActiveItem, active: 1 });
    }

    return {
      data,
    };
  }

  public async createDeck(item: DeckItem) {
    const db = this.getDB();
    const data = await (await db).add(STORAGE_DECKS, item);

    return {
      data,
    };
  }

  public async createOrUpdateDeck(item: DeckItem) {
    const db = this.getDB();
    const data = await (await db).put(STORAGE_DECKS, item);

    return {
      data,
    };
  }

  public async getDeck(id: string) {
    const db = this.getDB();
    const data = await (await db).get(STORAGE_DECKS, id);

    return {
      data,
    };
  }

  public async getActiveDeck() {
    const db = this.getDB();
    const activeDeckInfo = await (
      await db
    ).getFromIndex(STORAGE_DECK_CATALOG, 'active', 1);

    let data;

    if (activeDeckInfo) {
      data = await (await db).get(STORAGE_DECKS, activeDeckInfo.id);
    }

    return {
      data,
    };
  }

  public async deleteDeck(id: string) {
    const db = this.getDB();
    const data = await (await db).delete(STORAGE_DECKS, id);

    return {
      data,
    };
  }
}

export default FlashcardsAPI;
