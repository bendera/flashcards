import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { saveOption } from 'features/options/optionsSlice';
import FlashcardsAPI, { DeckItem } from 'utils/FlashcardsAPI';

type AsyncStatus = 'idle' | 'loading' | 'failed';

export interface DeckState {
  data: DeckItem;
  saveStatus: AsyncStatus;
  loadStatus: AsyncStatus;
  loaded: boolean;
}

/**
 * Hardcoded 5 boxes Leitner-cards system
 */
export const getUsedBoxes = (sessionCounter: number) => {
  let usedBoxes = [];

  if (sessionCounter % 1 === 0 && sessionCounter > 0) {
    usedBoxes.push(1);
  }

  if (sessionCounter % 2 === 0 && sessionCounter > 0) {
    usedBoxes.push(2);
  }

  if (sessionCounter % 4 === 0 && sessionCounter > 0) {
    usedBoxes.push(3);
  }

  if (sessionCounter % 9 === 0 && sessionCounter > 0) {
    usedBoxes.push(4);
  }

  if (sessionCounter % 14 === 0 && sessionCounter > 0) {
    usedBoxes.push(5);
  }

  return usedBoxes;
};

// #region thunks

const fetchActiveDeck = createAsyncThunk('deck/load', async () => {
  const api = new FlashcardsAPI();
  const res = await api.getActiveDeck();

  return res.data;
});

const saveDeck = createAsyncThunk(
  'deck/save',
  async (item: DeckItem | undefined, { getState }) => {
    let itemToSave: DeckItem;

    if (!item) {
      const state = getState() as RootState;
      itemToSave = state.deck.data;
    } else {
      itemToSave = item;
    }

    const api = new FlashcardsAPI();
    const res = await api.createOrUpdateDeck(itemToSave);

    return res.data;
  }
);

const deleteDeck = createAsyncThunk('deck/delete', async (id: string) => {
  const api = new FlashcardsAPI();
  const res = await api.deleteDeck(id);

  return res.data;
});

const resetDeckStats = createAsyncThunk(
  'deck/resetStats',
  async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const api = new FlashcardsAPI();

    await api.resetDeckStats(id);

    if (state.deck.data.id === id) {
      dispatch(resetStats());
    }

    return id;
  }
);

/**
 * Add the demo deck to the database.
 */
const createDemoDeck = createAsyncThunk(
  'deck/createDemo',
  async (_, { dispatch }) => {
    const api = new FlashcardsAPI();

    await api.populate();
    await dispatch(saveOption({ key: 'firstRun', value: false }));
  }
);

// #endregion

export const createInitialDeckState = (): DeckState => ({
  data: {
    cards: [],
    cardsByBoxes: {},
    drawCounter: 0,
    id: '',
    sessionCounter: 0,
    sessionFinished: false,
    numberOfSessionCards: 0,
    title: '',
    lastCard: '',
  },
  saveStatus: 'idle',
  loadStatus: 'idle',
  loaded: false,
});

const initialState = createInitialDeckState();

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    startNextSession(state) {
      state.data.sessionCounter += 1;
      state.data.drawCounter = 0;
      state.data.sessionFinished = false;

      const usedBoxes = getUsedBoxes(state.data.sessionCounter);

      state.data.numberOfSessionCards = Object.values(
        state.data.cardsByBoxes
      ).filter((val) => usedBoxes.includes(val)).length;

      deckSlice.caseReducers.draw(state);
    },
    draw(state) {
      const { sessionCounter, sessionFinished, lastCard, cardsByBoxes } =
        state.data;

      if (sessionCounter === 0 || sessionFinished) {
        return;
      }

      const usedBoxes = getUsedBoxes(sessionCounter);
      const ids = Object.keys(cardsByBoxes);
      const fromIndex = ids.findIndex((id) => id === lastCard);
      const nextCardIndex = ids.findIndex(
        (id, i) => usedBoxes.includes(cardsByBoxes[id]) && i > fromIndex
      );

      if (nextCardIndex !== -1) {
        state.data.lastCard = ids[nextCardIndex];
        state.data.drawCounter += 1;
      } else {
        state.data.lastCard = '';
        state.data.sessionFinished = true;
      }
    },
    promote(state) {
      const cardId = state.data.lastCard;
      const currentBox = state.data.cardsByBoxes[cardId];

      if (currentBox < 5) {
        state.data.cardsByBoxes[cardId] += 1;
      }

      deckSlice.caseReducers.draw(state);
    },
    demote(state) {
      const cardId = state.data.lastCard;
      const currentBox = state.data.cardsByBoxes[cardId];

      if (currentBox > 1) {
        state.data.cardsByBoxes[cardId] -= 1;
      }

      deckSlice.caseReducers.draw(state);
    },
    resetStats(state) {
      const { data } = state;

      data.sessionCounter = 0;
      data.drawCounter = 0;
      data.sessionFinished = false;
      data.numberOfSessionCards = 0;
      data.lastCard = '';

      const keys = Object.keys(data.cardsByBoxes);

      keys.forEach((k) => {
        data.cardsByBoxes[k] = 1;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchActiveDeck.pending, (state) => {
        state.loadStatus = 'loading';
        state.loaded = false;
      })
      .addCase(fetchActiveDeck.fulfilled, (state, action) => {
        state.loadStatus = 'idle';
        state.loaded = true;

        if (action.payload) {
          state.data = { ...initialState.data, ...action.payload };
        }
      })
      .addCase(fetchActiveDeck.rejected, (state) => {
        state.loadStatus = 'failed';
      });
  },
});

export const { startNextSession, draw, promote, demote, resetStats } =
  deckSlice.actions;

export {
  fetchActiveDeck,
  saveDeck,
  resetDeckStats,
  deleteDeck,
  createDemoDeck,
};

export default deckSlice.reducer;
