import { RootState } from 'app/store';

export const selectSessionCounter = (state: RootState) =>
  state.deck.data.sessionCounter;

export const selectDrawCounter = (state: RootState) =>
  state.deck.data.drawCounter;

export const selectCards = (state: RootState) => state.deck.data.cards;

export const selectLastCard = (state: RootState) => {
  const { data } = state.deck;
  const { cards, lastCard } = data;

  return cards.find((c) => c.id === lastCard);
};
