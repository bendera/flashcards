import { FC } from 'react';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { changeView } from 'features/navigation/navigationSlice';
import { selectDeckCatalogItems } from 'features/deckCatalog/deckCatalogSlice';

const ThereAreNoDecks: FC = () => {
  const dispatch = useAppDispatch();
  const dataLoaded = useAppSelector(
    (state) => state.deckCatalog.loaded && state.deck.loaded
  );
  const deckCatalogItems = useAppSelector(selectDeckCatalogItems);
  const thereAreNoDecks = deckCatalogItems.length < 1 && dataLoaded;

  const handleCreateDeck = () => {
    dispatch(changeView('settings/deck/edit'));
  };

  return thereAreNoDecks ? (
    <NonIdealState
      icon={IconNames.INBOX}
      title="There are no decks"
      description="It seems you have not created any deck yet."
      action={
        <Button intent={Intent.PRIMARY} large onClick={handleCreateDeck}>
          Create one
        </Button>
      }
    />
  ) : null;
};

export default ThereAreNoDecks;
