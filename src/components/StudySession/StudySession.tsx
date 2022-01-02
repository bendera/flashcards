import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  demote,
  draw,
  fetchActiveDeck,
  promote,
  saveDeck,
  startSession,
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

interface StudySessionProps {
  onCreateDeck: () => void;
  onSelectActiveDeck: () => void;
}

const StudySession: FC<StudySessionProps> = ({
  onCreateDeck,
  onSelectActiveDeck,
}) => {
  const dispatch = useAppDispatch();
  const lastCard = useSelector(selectLastCard);
  const sessionCounter = useSelector(selectSessionCounter);
  const activeDeck = useSelector(selectActiveDeckId);
  const [dataLoaded, setDataLoaded] = useState(false);
  const deckCatalogItems = useSelector(selectDeckCatalogItems);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const thereAreNoDecks = deckCatalogItems.length < 1 && dataLoaded;
  const thereIsNoActiveDeck = !activeDeck && !thereAreNoDecks && dataLoaded;
  const readyToUse = activeDeck && deckCatalogItems.length > 0 && dataLoaded;

  const handlePromoteClick = () => {
    setDirection('right');
    dispatch(promote());
    dispatch(draw());
    dispatch(saveDeck());
  };

  const handleDemoteClick = () => {
    setDirection('left');
    dispatch(demote());
    dispatch(draw());
    dispatch(saveDeck());
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
      if (sessionCounter > 0) {
        dispatch(draw());
      } else {
        dispatch(startSession());
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
            <div className={styles.buttons}>
              <Button
                className={styles.button}
                icon={IconNames.CROSS}
                intent={Intent.DANGER}
                large
                minimal
                onClick={() => {
                  handleDemoteClick();
                }}
              >
                Don't know
              </Button>
              <Button
                className={styles.button}
                icon={IconNames.TICK}
                intent={Intent.SUCCESS}
                large
                minimal
                onClick={() => {
                  handlePromoteClick();
                }}
              >
                Know
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudySession;
