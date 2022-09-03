import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppView =
  | 'study_session'
  | 'settings/deck/list'
  | 'settings/deck/edit'
  | 'settings/options';

interface NavigationState {
  currentView: AppView;
}

export const createInitialNavigationState = (): NavigationState => ({
  currentView: 'study_session',
});

const initialState = createInitialNavigationState();

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    changeView: (state, action: PayloadAction<AppView>) => {
      state.currentView = action.payload;
    },
  },
});

export const { changeView } = navigationSlice.actions;

export default navigationSlice.reducer;
