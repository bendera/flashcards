import { FC, useState } from 'react';
import { useAppDispatch } from 'app/hooks';
import { draw } from 'features/deck/deckSlice';
import PaperCard from './CardSwitcher/PaperCard/PaperCard';
import styles from './StudySession.module.css';
import CardSwitcher from './CardSwitcher/CardSwitcher';
import { FlashCard } from 'types';

interface StudySessionProps {
  props1?: string;
  props2?: string;
}

const StudySession: FC<StudySessionProps> = ({ props1, props2 }) => {
  const dispatch = useAppDispatch();
  const [demoCards, setDemoCards] = useState<FlashCard[]>([
    {
      backSide: 'puddle',
      frontSide: 'pocsolya',
      id: 'demo1',
    },
    {
      backSide: 'obsessive',
      frontSide: 'megszállott',
      id: 'demo2',
    },
    {
      backSide: 'sturdy',
      frontSide: 'erős',
      id: 'demo3',
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handleDrawClick = () => {
    dispatch(draw());
  };

  const handlePromoteClick = () => {
    setDirection('right');
    setCurrentIndex(currentIndex < demoCards.length - 1 ? currentIndex + 1 : 0);
  };

  const handleDemoteClick = () => {
    setDirection('left');
    setCurrentIndex(currentIndex < demoCards.length - 1 ? currentIndex + 1 : 0);
  };

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
      <CardSwitcher
        direction={direction}
        currentCard={demoCards[currentIndex]}
      />
    </div>
  );
};

export default StudySession;
