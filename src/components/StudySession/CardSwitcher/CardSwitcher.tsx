import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { FlashCard } from 'types';
import PaperCard from './PaperCard/PaperCard';
import styles from './CardSwitcher.module.css';

interface CardSwitcherProps {
  currentCard: FlashCard;
  direction: 'left' | 'right';
}

const emptyCard: FlashCard = {
  id: '<empty>',
  frontSide: '',
  backSide: '',
};

const CardSwitcher: FC<CardSwitcherProps> = ({
  currentCard,
  direction = 'left',
}) => {
  const [activeCardNum, setActiveCardNum] = useState(1);
  const [card1Visible, setCard1Visible] = useState<boolean>(false);
  const [card2Visible, setCard2Visible] = useState<boolean>(false);
  const [card1, setCard1] = useState<FlashCard>(emptyCard);
  const [card2, setCard2] = useState<FlashCard>(emptyCard);

  useEffect(() => {
    if (!currentCard) {
      return;
    }

    console.log('currentCard:', currentCard);

    if (activeCardNum === 1) {
      setCard1(currentCard);
      setCard1Visible(true);
      
      if (card2.id !== '<empty>') {
        setCard2Visible(false);
      }

      setActiveCardNum(2);
    } else if (activeCardNum === 2) {
      setCard2(currentCard);
      setCard2Visible(true);
      
      if (card1.id !== '<empty>') {
        setCard1Visible(false);
      }
      
      setActiveCardNum(1);
    }
  }, [currentCard]);

  return (
    <div className={styles.root}>
      <PaperCard
        frontSide={card1.frontSide}
        backSide={card1.backSide}
        enter={card1Visible}
        exitAnimationType={direction === 'left' ? 'swipeLeft' : 'swipeRight'}
        className={styles.card}
      />
      <PaperCard
        frontSide={card2.frontSide}
        backSide={card2.backSide}
        enter={card2Visible}
        exitAnimationType={direction === 'left' ? 'swipeLeft' : 'swipeRight'}
        className={styles.card}
      />
    </div>
  );
};

export default CardSwitcher;
