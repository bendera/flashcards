import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { AsyncStatus } from 'types';
import FlashcardsAPI, { DeckCatalogItem } from 'utils/FlashcardsAPI';

export interface DeckCatalogState {
  entities: {
    byId: {
      [key: string]: DeckCatalogItem;
    };
    allIds: string[];
  };
  status: AsyncStatus;
  loaded: boolean;
}

const initialState: DeckCatalogState = {
  entities: { byId: {}, allIds: [] },
  status: 'idle',
  loaded: false,
};

export const fetchCatalog = createAsyncThunk(
  'deckCatalog/load',
  async (_, { dispatch }) => {
    const api = new FlashcardsAPI();
    const res = await api.getDeckCatalog();

    dispatch(addCatalogItems(res.data));
  }
);

export const updateCatalogItem = createAsyncThunk(
  'deckCatalog/update',
  async (item: DeckCatalogItem, { dispatch, getState }) => {
    const api = new FlashcardsAPI();
    const res = api.updateDeckCatalogItem(item);
  }
);

export const deckCatalogSlice = createSlice({
  name: 'deckCatalog',
  initialState,
  reducers: {
    addCatalogItems(state, action: PayloadAction<DeckCatalogItem[]>) {
      state.entities.byId = {};
      state.entities.allIds = [];

      action.payload.forEach((d) => {
        const { id } = d;

        state.entities.byId[id] = d;
        state.entities.allIds.push(id);
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalog.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(fetchCatalog.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addCatalogItems } = deckCatalogSlice.actions;

export const selectDeckCatalogItems = (state: RootState) => {
  const { entities } = state.deckCatalog;

  return entities.allIds.map((id) => entities.byId[id]);
};

export default deckCatalogSlice.reducer;
