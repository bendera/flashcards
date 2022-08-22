import { FC } from 'react';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FlashCard } from 'types';
import BatchEditToolbar from '../BatchEditToolbar/BatchEditToolbar';
import CardItem from './CardItem/CardItem';
import styles from './CardItemList.module.css';
import { nanoid } from 'nanoid';

export interface CardListItemData extends FlashCard {
  selected: boolean;
}

const createAnEmptyItem = (): CardListItemData => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
    selected: false,
  };
};

export type CardItemListOperation = 'change' | 'delete' | 'add' | 'batch edit';

interface CardItemListProps {
  cards: CardListItemData[];
  onChange: (
    cards: CardListItemData[],
    operation?: CardItemListOperation
  ) => void;
}

const CardItemList: FC<CardItemListProps> = ({ cards, onChange }) => {
  const handleCardItemChange = (card: CardListItemData) => {
    const newList = cards.map((c) => {
      if (c.id !== card.id) {
        return c;
      }

      return card;
    });

    onChange(newList, 'change');
  };

  const handleDelete = (card: CardListItemData) => {
    const newList = cards.filter((c) => c.id !== card.id);

    onChange(newList, 'delete');
  };

  const handleAddCardClick = () => {
    const newItem = createAnEmptyItem();

    onChange([...cards, newItem], 'add');
  };

  const handleBatchEditChange = (cards: CardListItemData[]) => {
    onChange(cards, 'batch edit');
  };

  return (
    <div className={styles.root}>
      {cards.length > 0 && (
        <BatchEditToolbar onChange={handleBatchEditChange} cards={cards} />
      )}
      <div className={styles.cards}>
        {cards.map((c, i) => (
          <CardItem
            card={c}
            className={styles.cardItem}
            key={c.id}
            onChange={handleCardItemChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Button icon={IconNames.ADD} onClick={handleAddCardClick}>
        Add card
      </Button>
    </div>
  );
};

export default CardItemList;
