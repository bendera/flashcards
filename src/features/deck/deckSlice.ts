import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { RootState, AppThunk } from '../../app/store';

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
  status: 'idle' | 'loading' | 'failed';
}

const initialState: DeckState = {
  cards: {
    byId: {},
    allIds: [],
  },
  lastId: '0',
  status: 'idle',
};

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
});

export const { addCards } = deckSlice.actions;

export default deckSlice.reducer;
