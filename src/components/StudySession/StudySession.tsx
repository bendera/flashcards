import { FC, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  demote,
  promote,
  saveDeck,
  startNextSession,
} from 'features/deck/deckSlice';
import { selectLastCard, selectSessionCounter } from 'features/deck/selectors';
import {
  selectActiveDeckId,
  selectDeckCatalogItems,
} from 'features/deckCatalog/deckCatalogSlice';

import ActionButtons from './ActionButtons/ActionButtons';
import CurrentDeckTitle from './CurrentDeckTitle/CurrentDeckTitle';
import Boxes from './Boxes/Boxes';
import CardSwitcher from './CardSwitcher/CardSwitcher';
import ThereAreNoDecks from './ThereAreNoDecks';
import ThereIsNoActiveDeck from './ThereIsNoActiveDeck';
import styles from './StudySession.module.css';
import ThereAreNoCards from './ThereAreNoCards';

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
        <ThereAreNoDecks />
        <ThereIsNoActiveDeck />
        <ThereAreNoCards />
        {readyToUse && (
          <>
            <div className={styles.cards}>
              {lastCard ? (
                <CardSwitcher direction={direction} currentCard={lastCard} />
              ) : null}
            </div>
            {!sessionFinished && (
              <ActionButtons
                onPromote={handlePromote}
                onDemote={handleDemote}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudySession;
