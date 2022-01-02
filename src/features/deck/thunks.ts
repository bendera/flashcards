import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import FlashcardsAPI, { DeckItem } from 'utils/FlashcardsAPI';

export const fetchActiveDeck = createAsyncThunk('deck/load', async () => {
  const api = new FlashcardsAPI();
  const res = await api.getActiveDeck();

  return res.data;
});

export const saveDeck = createAsyncThunk(
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

export const deleteDeck = createAsyncThunk(
  'deck/delete',
  async (id: string) => {
    const api = new FlashcardsAPI();
    const res = await api.deleteDeck(id);

    return res.data;
  }
);
