import { FC, useEffect, useState } from 'react';
import { FlashCard } from 'types';
import PaperCard from './PaperCard/PaperCard';
import styles from './CardSwitcher.module.css';

const EMPTY_CARD_ID = '<empty>';

const emptyCard: FlashCard = {
  id: EMPTY_CARD_ID,
  frontSide: '',
  backSide: '',
};

interface CardSwitcherProps {
  currentCard: FlashCard;
  direction: 'left' | 'right';
}

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

    if (activeCardNum === 1) {
      setCard1(currentCard);
      setCard1Visible(true);
      
      if (card2.id !== EMPTY_CARD_ID) {
        setCard2Visible(false);
      }

      setActiveCardNum(2);
    } else if (activeCardNum === 2) {
      setCard2(currentCard);
      setCard2Visible(true);
      
      if (card1.id !== EMPTY_CARD_ID) {
        setCard1Visible(false);
      }
      
      setActiveCardNum(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard]);

  return (
    <div className={styles.root}>
      <PaperCard
        frontSide={card1.frontSide}
        backSide={card1.backSide}
        show={card1Visible}
        exitAnimationType={direction === 'left' ? 'swipeLeft' : 'swipeRight'}
        className={styles.card}
      />
      <PaperCard
        frontSide={card2.frontSide}
        backSide={card2.backSide}
        show={card2Visible}
        exitAnimationType={direction === 'left' ? 'swipeLeft' : 'swipeRight'}
        className={styles.card}
      />
    </div>
  );
};

export default CardSwitcher;
