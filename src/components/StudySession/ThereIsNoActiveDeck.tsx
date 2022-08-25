import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectActiveDeckId, selectDeckCatalogItems } from 'features/deckCatalog/deckCatalogSlice';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { changeView } from 'features/navigation/navigationSlice';

const ThereIsNoActiveDeck: FC = () => {
  const dispatch = useAppDispatch();
  const activeDeck = useAppSelector(selectActiveDeckId);
  const dataLoaded = useAppSelector(
    (state) => state.deckCatalog.loaded && state.deck.loaded
  );
  const deckCatalogItems = useAppSelector(selectDeckCatalogItems);
  const thereAreNoDecks = deckCatalogItems.length < 1 && dataLoaded;
  const thereIsNoActiveDeck = !activeDeck && !thereAreNoDecks && dataLoaded;

  const handleSelectDeck = () => {
    dispatch(changeView('settings/deck/list'));
  };


  return thereIsNoActiveDeck ? (
    <NonIdealState
      icon={IconNames.INBOX}
      title="There is no active deck"
      description="You should select a deck to start practicing."
      action={
        <Button intent={Intent.PRIMARY} large onClick={handleSelectDeck}>
          Select one
        </Button>
      }
    />
  ) : null;
};

export default ThereIsNoActiveDeck;
