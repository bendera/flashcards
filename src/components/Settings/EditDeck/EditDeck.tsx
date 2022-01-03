import { FC, RefObject, useEffect, useRef } from 'react';
import { Button, EditableText, Intent } from '@blueprintjs/core';
import cn from 'classnames';

import { DeckCatalogItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import useEditDeck from './useEditDeck';
import styles from './EditDeck.module.css';
import { IconNames } from '@blueprintjs/icons';

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
  onEditFinished: () => void;
  /**
   * Reference to ancestor element to scroll
   */
  ancestorElementRef?: RefObject<HTMLElement>;
}

const EditDeck: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
  onEditFinished,
  ancestorElementRef = null,
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
  } = useEditDeck(deckToEdit, onEditFinished, ancestorElementRef);

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckToEdit]);

  return (
    <div>
      <h1 className={cn('bp3-heading', styles.heading)}>
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
        <Button icon={IconNames.ADD} onClick={handleAddCardClick}>
          Add card
        </Button>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          intent={Intent.PRIMARY}
          large
          onClick={handleSave}
        >
          Save deck
        </Button>
        <Button className={styles.button} large minimal onClick={handleSave}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditDeck;
