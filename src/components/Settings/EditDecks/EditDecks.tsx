import { FC, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import { FlashCard } from 'types';
import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import styles from './EditDecks.module.css';

const createAnEmptyCard = (): FlashCard => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
  };
};

const EditDecks: FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([createAnEmptyCard()]);

  const handleAddCardClick = () => {
    setCards([...cards, createAnEmptyCard()]);
  };

  return (
    <div>
      <ImportCards />
      <div className={styles.cards}>
        {cards.map((c) => (
          <CardItem card={c} key={c.id} />
        ))}
      </div>
      <Button onClick={handleAddCardClick}>Add card</Button>
    </div>
  );
};

export default EditDecks;
