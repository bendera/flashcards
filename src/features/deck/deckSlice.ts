import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FlashcardsAPI, { DeckItem } from 'utils/FlashcardsAPI';

type AsyncStatus = 'idle' | 'loading' | 'failed';

export interface CardDO {
  frontSide: string;
  backSide: string;
}

export interface Card extends CardDO {
  id: string;
}

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
    title: '',
  },
  saveStatus: 'idle',
  loadStatus: 'idle',
};

export const fetchActiveDeck = createAsyncThunk('deck/load', async () => {
  const api = new FlashcardsAPI();
  const res = await api.getActiveDeck();

  return res.data;
});

export const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchActiveDeck.pending, (state) => {
        state.loadStatus = 'loading';
      })
      .addCase(fetchActiveDeck.fulfilled, (state, action) => {
        state.loadStatus = 'idle';

        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(fetchActiveDeck.rejected, (state) => {
        state.loadStatus = 'failed';
      });
  },
});

export default deckSlice.reducer;
