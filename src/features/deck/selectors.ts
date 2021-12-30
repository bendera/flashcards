import { RootState } from 'app/store';

export const selectSessionCounter = (state: RootState) =>
  state.deck.data.sessionCounter;

export const selectDrawCounter = (state: RootState) =>
  state.deck.data.drawCounter;

export const selectCards = (state: RootState) => state.deck.data.cards;
