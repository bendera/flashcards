import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { FlashCard } from 'types';
import PaperCard from './PaperCard/PaperCard';
import styles from './CardSwitcher.module.css';

interface CardSwitcherProps {
  currentCard: FlashCard;
  direction: 'left' | 'right';
}

const CardSwitcher: FC<CardSwitcherProps> = ({ currentCard, direction }) => {
  const [animate, setAnimate] = useState(false);
  const [incomingCard, setIncomingCard] = useState<FlashCard>();
  const [leavingCard, setLeavingCard] = useState<FlashCard>();

  const cardWrapperClasses = cn([styles.cardWrapper]);

  useEffect(() => {
    if (incomingCard) {
      setLeavingCard(incomingCard);
    }

    setIncomingCard(currentCard);
    setAnimate(!animate);
  }, [currentCard]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        onClick={() => {
          setAnimate(!animate);
        }}
      >
        switch
      </button>

      

      {leavingCard && (
        <PaperCard
          frontSide={leavingCard.frontSide}
          backSide={leavingCard.backSide}
          animate={animate}
          animationType={direction === 'left' ? 'swipeLeft' : 'swipeRight'}
          className={styles.card}
        />
      )}

{incomingCard && (
        <PaperCard
          frontSide={incomingCard.frontSide}
          backSide={incomingCard.backSide}
          animate={animate}
          animationType="fadeIn"
          className={styles.card}
        />
      )}
    </div>
  );
};

export default CardSwitcher;
