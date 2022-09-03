import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  PreloadedState,
} from '@reduxjs/toolkit';
import deckReducer from '../features/deck/deckSlice';
import deckCatalogReducer from '../features/deckCatalog/deckCatalogSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import optionsReducer from '../features/options/optionsSlice';

const rootReducer = combineReducers({
  deck: deckReducer,
  deckCatalog: deckCatalogReducer,
  navigation: navigationReducer,
  options: optionsReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState });

export const store  = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
