import { FC, useEffect } from 'react';
import { Button, EditableText } from '@blueprintjs/core';

import { DeckCatalogItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import useEditDeck from './useEditDeck';
import styles from './EditDeck.module.css';

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
  onEditFinished: () => void;
}

const EditDeck: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
  onEditFinished,
}) => {
  const {
    cards,
    deckTitle,
    fetchDeck,
    handleAddCardClick,
    handleCardItemChange,
    handleDelete,
    handleImport,
    handleSave,
    handleSwap,
    handleTitleChange,
  } = useEditDeck(deckToEdit, onEditFinished);

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckToEdit]);

  return (
    <div>
      <h1 className="bp3-heading">
        <EditableText
          onChange={handleTitleChange}
          placeholder="Edit title..."
          value={deckTitle}
        />
      </h1>
      <ImportCards onImport={handleImport} />
      <div className={styles.cards}>
        {cards.map((c) => (
          <CardItem
            card={c}
            key={c.id}
            onChange={handleCardItemChange}
            onDelete={handleDelete}
            onSwap={handleSwap}
          />
        ))}
      </div>
      <Button onClick={handleAddCardClick}>Add card</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default EditDeck;
