import { RootState } from 'app/store';
import { getUsedBoxes } from './deckSlice';

export const selectSessionCounter = (state: RootState) =>
  state.deck.data.sessionCounter;

export const selectDrawCounter = (state: RootState) =>
  state.deck.data.drawCounter;

export const selectCurrentDeckTitle = (state: RootState) =>
  state.deck.data.title || '';

export const selectCardsByBoxes = (state: RootState) =>
  state.deck.data.cardsByBoxes;

export const selectNumberOfCardsByBoxes = (state: RootState) => {
  const numBoxes = 5;
  const numCards = [];
  const keys = Object.keys(state.deck.data.cardsByBoxes);

  for (let i = 0; i < numBoxes; i++) {
    numCards.push(
      keys.filter((k) => state.deck.data.cardsByBoxes[k] === i + 1).length
    );
  }

  return numCards;
};

export const selectUsedBoxes = (state: RootState) =>
  getUsedBoxes(state.deck.data.sessionCounter);

export const selectNumberOfTotalCards = (state: RootState) =>
  state.deck.data.numberOfSessionCards;

export const selectNumberOfCurrentCard = (state: RootState) => {
  const counter = state.deck.data.drawCounter;

  return counter > 0 ? counter : 0;
};

export const selectCards = (state: RootState) => state.deck.data.cards;

export const selectLastCard = (state: RootState) => {
  const { data } = state.deck;
  const { cards, lastCard } = data;

  return cards.find((c) => c.id === lastCard);
};

export const selectSessionFinished = (state: RootState) =>
  state.deck.data.sessionFinished;
