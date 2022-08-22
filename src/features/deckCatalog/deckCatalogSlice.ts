import {
  createAsyncThunk,
  createSlice,
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

export const fetchCatalog = createAsyncThunk('deckCatalog/load', async () => {
  const api = new FlashcardsAPI();
  const res = await api.getDeckCatalog();

  return res.data;
});

export const createCatalogItem = createAsyncThunk(
  'deckCatalog/create',
  async (item: DeckCatalogItem) => {
    const api = new FlashcardsAPI();
    const res = await api.addDeckCatalogItem(item);

    return res.data;
  }
);

export const updateCatalogItem = createAsyncThunk(
  'deckCatalog/update',
  async (item: DeckCatalogItem) => {
    const api = new FlashcardsAPI();
    const res = await api.updateDeckCatalogItem(item);

    return res.data;
  }
);

export const deleteCatalogItem = createAsyncThunk(
  'deckCatalog/delete',
  async (id: string) => {
    const api = new FlashcardsAPI();
    const res = await api.deleteDeckCatalogItem(id);

    return res.data;
  }
);

export const setActiveCatalog = createAsyncThunk(
  'deckCatalog/setActive',
  async (id: string) => {
    const api = new FlashcardsAPI();
    const res = await api.setActiveDeckCatalog(id);

    return res.data;
  }
);

export const deckCatalogSlice = createSlice({
  name: 'deckCatalog',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.status = 'idle';

        state.entities.byId = {};
        state.entities.allIds = [];

        action.payload.forEach((d) => {
          const { id } = d;

          state.entities.byId[id] = d;
          state.entities.allIds.push(id);
        });
      })
      .addCase(fetchCatalog.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectDeckCatalogItems = (state: RootState) => {
  const { entities } = state.deckCatalog;

  return entities.allIds.map((id) => entities.byId[id]);
};

export const selectActiveDeckId = (state: RootState) => {
  const { allIds, byId } = state.deckCatalog.entities;

  return allIds.find((id) => byId[id].active === 1);
};

export default deckCatalogSlice.reducer;
