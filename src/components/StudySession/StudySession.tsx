import { FC } from 'react';
import cn from 'classnames';
import { useAppDispatch } from 'app/hooks';
import { draw } from 'features/deck/deckSlice';
import Flashcard from './Flashcard/Flashcard';
import styles from './StudySession.module.css';

interface StudySessionProps {
  props1?: string;
  props2?: string;
}

const StudySession: FC<StudySessionProps> = ({ props1, props2 }) => {
  const dispatch = useAppDispatch();

  const handleDrawClick = () => {
    dispatch(draw());
  };

  const handlePromoteClick = () => {};

  const handleDemoteClick = () => {};

  const cardWrapperClasses = cn([
    styles.cardWrapper,
    styles.swipeLeft,
    styles.swipeRight,
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.temp}>
        <button
          type="button"
          onClick={() => {
            handleDrawClick();
          }}
        >
          draw
        </button>
        <button
          type="button"
          onClick={() => {
            handlePromoteClick();
          }}
        >
          promote
        </button>
        <button
          type="button"
          onClick={() => {
            handleDemoteClick();
          }}
        >
          demote
        </button>
      </div>
      <div className={styles.perspectiveWrapper}>
        <div className={cardWrapperClasses}>
          <Flashcard frontSide="Lorem" backSide="Ipsum" />
        </div>
      </div>
    </div>
  );
};

export default StudySession;
