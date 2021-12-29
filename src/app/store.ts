import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import deckReducer from '../features/deck/deckSlice';
import deckCatalogReducer from '../features/deckCatalog/deckCatalogSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
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
