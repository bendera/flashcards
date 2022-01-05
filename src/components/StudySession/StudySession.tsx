import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  demote,
  draw,
  fetchActiveDeck,
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
  fetchCatalog,
  selectActiveDeckId,
  selectDeckCatalogItems,
} from 'features/deckCatalog/deckCatalogSlice';
import ActionButtons from './ActionButtons/ActionButtons';

interface StudySessionProps {
  onCreateDeck: () => void;
  onSelectActiveDeck: () => void;
}

const StudySession: FC<StudySessionProps> = ({
  onCreateDeck,
  onSelectActiveDeck,
}) => {
  const dispatch = useAppDispatch();
  const lastCard = useAppSelector(selectLastCard);
  const sessionCounter = useAppSelector(selectSessionCounter);
  const activeDeck = useAppSelector(selectActiveDeckId);
  const sessionFinished = useAppSelector(
    (state) => state.deck.data.sessionFinished
  );
  const deckCatalogItems = useAppSelector(selectDeckCatalogItems);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const thereAreNoDecks = deckCatalogItems.length < 1 && dataLoaded;
  const thereIsNoActiveDeck = !activeDeck && !thereAreNoDecks && dataLoaded;
  const readyToUse = activeDeck && deckCatalogItems.length > 0 && dataLoaded;

  const handlePromote = () => {
    setDirection('right');
    dispatch(promote());
    dispatch(draw());
    dispatch(saveDeck());
  };

  const handleDemote = () => {
    setDirection('left');
    dispatch(demote());
    dispatch(draw());
    dispatch(saveDeck());
  };

  const startNewSession = () => {
    dispatch(startNextSession());
    dispatch(draw());
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCatalog());
      await dispatch(fetchActiveDeck());
      setDataLoaded(true);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const init = () => {
      if (sessionCounter < 1) {
        dispatch(startNextSession());
        dispatch(draw());
      }
    };

    if (readyToUse) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, readyToUse]);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {thereAreNoDecks && (
          <NonIdealState
            icon={IconNames.INBOX}
            title="There are no decks"
            description="It seems you have not created any deck yet."
            action={
              <Button intent={Intent.PRIMARY} large onClick={onCreateDeck}>
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
              <Button intent={Intent.PRIMARY} large onClick={onCreateDeck}>
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
                    Start a new session
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
