import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import {
  demote,
  draw,
  fetchActiveDeck,
  promote,
  startSession,
} from 'features/deck/deckSlice';
import { selectLastCard, selectSessionCounter } from 'features/deck/selectors';
import CardSwitcher from './CardSwitcher/CardSwitcher';
import styles from './StudySession.module.css';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

const StudySession: FC = () => {
  const dispatch = useAppDispatch();
  const lastCard = useSelector(selectLastCard);
  const sessionCounter = useSelector(selectSessionCounter);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handlePromoteClick = () => {
    setDirection('right');
    dispatch(promote());
    dispatch(draw());
  };

  const handleDemoteClick = () => {
    setDirection('left');
    dispatch(demote());
    dispatch(draw());
  };

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchActiveDeck());

      if (sessionCounter > 0) {
        dispatch(draw());
      } else {
        dispatch(startSession());
        dispatch(draw());
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
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
      </div>
    </div>
  );
};

export default StudySession;
