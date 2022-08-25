import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  demote,
  promote,
  saveDeck,
  startNextSession,
} from 'features/deck/deckSlice';
import { selectLastCard, selectSessionCounter } from 'features/deck/selectors';
import CardSwitcher from './CardSwitcher/CardSwitcher';
import styles from './StudySession.module.css';
import { Button, Intent, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import {
  selectActiveDeckId,
  selectDeckCatalogItems,
} from 'features/deckCatalog/deckCatalogSlice';
import ActionButtons from './ActionButtons/ActionButtons';
import CurrentDeckTitle from './CurrentDeckTitle/CurrentDeckTitle';
import Boxes from './Boxes/Boxes';
import { changeView } from 'features/navigation/navigationSlice';

const StudySession: FC = () => {
  const dispatch = useAppDispatch();
  const lastCard = useAppSelector(selectLastCard);
  const sessionCounter = useAppSelector(selectSessionCounter);
  const activeDeck = useAppSelector(selectActiveDeckId);
  const sessionFinished = useAppSelector(
    (state) => state.deck.data.sessionFinished
  );
  const dataLoaded = useAppSelector(
    (state) => state.deckCatalog.loaded && state.deck.loaded
  );
  const deckCatalogItems = useAppSelector(selectDeckCatalogItems);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const thereAreNoDecks = deckCatalogItems.length < 1 && dataLoaded;
  const thereIsNoActiveDeck = !activeDeck && !thereAreNoDecks && dataLoaded;
  const readyToUse = activeDeck && deckCatalogItems.length > 0 && dataLoaded;

  const handlePromote = () => {
    setDirection('right');
    dispatch(promote());
    dispatch(saveDeck());
  };

  const handleDemote = () => {
    setDirection('left');
    dispatch(demote());
    dispatch(saveDeck());
  };

  const handleSelectDeck = () => {
    dispatch(changeView('settings/deck/list'));
  };

  const handleCreateDeck = () => {
    dispatch(changeView('settings/deck/edit'));
  };

  const startNewSession = () => {
    dispatch(startNextSession());
  };

  useEffect(() => {
    const init = () => {
      if (sessionCounter < 1) {
        dispatch(startNextSession());
      }
    };

    if (activeDeck && dataLoaded) {
      init();
    }
  }, [dispatch, activeDeck, dataLoaded, sessionCounter]);

  return (
    <div className={styles.root}>
      <CurrentDeckTitle className={styles.title} />
      <Boxes className={styles.boxes} />
      <div className={styles.content}>
        {thereAreNoDecks && (
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
        )}
        {thereIsNoActiveDeck && (
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
        )}
        {readyToUse && (
          <>
            <div className={styles.cards}>
              {lastCard ? (
                <CardSwitcher direction={direction} currentCard={lastCard} />
              ) : null}
            </div>
            {!sessionFinished ? (
              <ActionButtons
                onPromote={handlePromote}
                onDemote={handleDemote}
              />
            ) : (
              <NonIdealState
                title="The cards are out"
                action={
                  <Button
                    intent={Intent.PRIMARY}
                    large
                    onClick={() => {
                      startNewSession();
                    }}
                  >
                    Start Session {sessionCounter + 1}
                  </Button>
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudySession;
