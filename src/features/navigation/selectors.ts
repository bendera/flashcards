import { RootState } from 'app/store';

export const selectCurrentView = (state: RootState) =>
  state.navigation.currentView;
