import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import * as deckAPI from './deckAPI';
import { SaveDeckDO } from './deckAPI';

type AsyncStatus = 'idle' | 'loading' | 'failed';

export interface CardDO {
  frontSide: string;
  backSide: string;
}

export interface Card extends CardDO {
  id: string;
}

export interface DeckState {
  cards: {
    byId: {
      [key: string]: Card;
    };
    allIds: string[];
  };
  lastId: string;
  saveStatus: AsyncStatus;
  loadStatus: AsyncStatus;
}

const initialState: DeckState = {
  cards: {
    byId: {},
    allIds: [],
  },
  lastId: '0',
  saveStatus: 'idle',
  loadStatus: 'idle',
};

export const saveDeck = createAsyncThunk(
  'deck/save',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { cards, lastId } = state.deck;
    const data: SaveDeckDO = {
      cards: cards.byId,
      lastId,
    };

    const res = await deckAPI.save(data);
    return res;
  },
);

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    addCards(state, action: PayloadAction<CardDO[]>) {
      const lastId = parseInt(state.lastId, 26);

      action.payload.forEach(({ frontSide, backSide }, i) => {
        const newId = Number(lastId + i + 1).toString(26);

        state.cards.byId[newId] = {
          id: newId,
          frontSide,
          backSide,
        };
        state.cards.allIds.push(newId);
      });

      state.lastId = Number(lastId + action.payload.length).toString(26);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(saveDeck.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(saveDeck.fulfilled, (state) => {
        state.saveStatus = 'idle';
      })
      .addCase(saveDeck.rejected, (state) => {
        state.saveStatus = 'failed';
      });
  },
});

export const { addCards } = deckSlice.actions;

export default deckSlice.reducer;
