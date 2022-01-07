import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import deckReducer from '../features/deck/deckSlice';
import deckCatalogReducer from '../features/deckCatalog/deckCatalogSlice';
import navigationReducer from '../features/navigation/navigationSlice';

export const store = configureStore({
  reducer: {
    deck: deckReducer,
    deckCatalog: deckCatalogReducer,
    navigation: navigationReducer,
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
