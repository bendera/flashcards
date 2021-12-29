import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import deckReducer from '../features/deck/deckSlice';
import deckCatalogReducer from '../features/deckCatalog/deckCatalogSlice';

export const store = configureStore({
  reducer: {
    deck: deckReducer,
    deckCatalog: deckCatalogReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
