import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { AppStore, RootState, setupStore } from '../app/store';
import { createInitialDeckState } from 'features/deck/deckSlice';
import { createInitialDeckCatalogState } from 'features/deckCatalog/deckCatalogSlice';
import { createInitialNavigationState } from 'features/navigation/navigationSlice';
import { createInitialOptionsState } from 'features/options/optionsSlice';

export const createInitialState = (): RootState => ({
  deck: createInitialDeckState(),
  deckCatalog: createInitialDeckCatalogState(),
  navigation: createInitialNavigationState(),
  options: createInitialOptionsState(),
});

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
