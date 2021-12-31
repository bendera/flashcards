import { FC, useState } from 'react';
import cn from 'classnames';
import { FlashCard } from 'types';
import PaperCard from './PaperCard/PaperCard';
import styles from './CardSwitcher.module.css';

interface CardSwitcherProps {
  currentCard: FlashCard;
  direction: 'left' | 'right';
}

const CardSwitcher: FC<CardSwitcherProps> = ({ currentCard }) => {
  const [switchCounter, setSwitchCounter] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [prevCard, setPrevCard] = useState<FlashCard>();

  const cardWrapperClasses = cn([styles.cardWrapper]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        onClick={() => {
          setAnimate(!animate);
        }}
      >
        toggle
      </button>
      <PaperCard
        frontSide="Lorem"
        backSide="Ipsum"
        animate={animate}
        animationType="fadeIn"
        className={styles.card}
      />
      <PaperCard
        frontSide="Lorem"
        backSide="Ipsum"
        animate={animate}
        animationType="swipeLeft"
        className={styles.card}
      />
    </div>
  );
};

export default CardSwitcher;
