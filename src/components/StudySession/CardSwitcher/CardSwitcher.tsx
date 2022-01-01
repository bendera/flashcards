import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { FlashCard } from 'types';
import PaperCard from './PaperCard/PaperCard';
import styles from './CardSwitcher.module.css';

interface CardSwitcherProps {
  currentCard?: FlashCard;
  direction: 'left' | 'right';
}

const CardSwitcher: FC<CardSwitcherProps> = ({ currentCard, direction }) => {
  const [firstRound, setFirstRound] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [incomingCard, setIncomingCard] = useState<FlashCard | undefined>(
    undefined
  );
  const [leavingCard, setLeavingCard] = useState<FlashCard | undefined>(
    undefined
  );

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
