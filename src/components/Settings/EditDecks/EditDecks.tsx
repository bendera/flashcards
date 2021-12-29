import { FC, useState } from 'react';
import { Button, EditableText } from '@blueprintjs/core';
import { nanoid } from 'nanoid';

import { FlashCard } from 'types';
import { useAppDispatch } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import styles from './EditDecks.module.css';
import { updateCatalogItem } from 'features/deckCatalog/deckCatalogSlice';

const createAnEmptyCard = (): FlashCard => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
  };
};

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
}

const EditDecks: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
}) => {
  const { active, id, title } = deckToEdit;
  const dispatch = useAppDispatch();
  const [deckTitle, setDeckTitle] = useState(title);
  const [cards, setCards] = useState<FlashCard[]>([createAnEmptyCard()]);

  const handleAddCardClick = () => {
    setCards([...cards, createAnEmptyCard()]);
  };

  const handleSave = () => {
    dispatch(
      updateCatalogItem({
        id,
        title: deckTitle,
        active,
      })
    );
  };

  const handleTitleChange = (value: string) => {
    setDeckTitle(value);
  };

  return (
    <div>
      <h1 className="bp3-heading">
        <EditableText
          onChange={handleTitleChange}
          placeholder="Edit title..."
          value={deckTitle}
        />
      </h1>
      <ImportCards />
      <div className={styles.cards}>
        {cards.map((c) => (
          <CardItem card={c} key={c.id} />
        ))}
      </div>
      <Button onClick={handleAddCardClick}>Add card</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default EditDecks;
