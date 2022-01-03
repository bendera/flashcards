import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeckItem } from 'utils/FlashcardsAPI';
import { fetchActiveDeck, saveDeck } from './thunks';

type AsyncStatus = 'idle' | 'loading' | 'failed';

export interface DeckState {
  data: DeckItem;
  saveStatus: AsyncStatus;
  loadStatus: AsyncStatus;
}

const initialState: DeckState = {
  data: {
    cards: [],
    cardsByBoxes: {},
    drawCounter: 0,
    id: '',
    sessionCounter: 0,
    sessionFinished: false,
    title: '',
    lastCard: '',
  },
  saveStatus: 'idle',
  loadStatus: 'idle',
};

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    startNextSession(state) {
      state.data.sessionCounter += 1;
      state.data.sessionFinished = false;
    },
    draw(state) {
      const { sessionCounter, sessionFinished, lastCard, cardsByBoxes } = state.data;

      if (sessionCounter === 0 || sessionFinished) {
        return;
      }

      let usedBoxes = [1];

      if (sessionCounter % 2 === 0) {
        usedBoxes.push(2);
      }

      if (sessionCounter % 4 === 0) {
        usedBoxes.push(3);
      }

      if (sessionCounter % 9 === 0) {
        usedBoxes.push(4);
      }

      if (sessionCounter % 14 === 0) {
        usedBoxes.push(5);
      }

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
    },
    demote(state) {
      const cardId = state.data.lastCard;
      const currentBox = state.data.cardsByBoxes[cardId];

      if (currentBox > 1) {
        state.data.cardsByBoxes[cardId] -= 1;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchActiveDeck.pending, (state) => {
        state.loadStatus = 'loading';
      })
      .addCase(fetchActiveDeck.fulfilled, (state, action) => {
        state.loadStatus = 'idle';

        if (action.payload) {
          state.data = { ...initialState.data, ...action.payload };
        }
      })
      .addCase(fetchActiveDeck.rejected, (state) => {
        state.loadStatus = 'failed';
      });
  },
});

export const { startNextSession, draw, promote, demote } = deckSlice.actions;

export { fetchActiveDeck, saveDeck };

export default deckSlice.reducer;
