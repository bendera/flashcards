import { FC, RefObject, useEffect } from 'react';
import { Button, Divider, EditableText, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import cn from 'classnames';

import { DeckCatalogItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import BatchEditToolbar from './BatchEditToolbar/BatchEditToolbar';
import useEditDeck from './useEditDeck';
import styles from './EditDeck.module.css';

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
    checkboxStates,
    deckTitle,
    fetchDeck,
    handleAddCardClick,
    handleBatchEditChange,
    handleCardItemChange,
    handleCardItemCheckboxChange,
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
        {cards.length > 0 && (
          <>
            <BatchEditToolbar
              onChange={handleBatchEditChange}
              cards={cards}
              checkboxStates={checkboxStates}
            />
            <Divider />
          </>
        )}
        {cards.map((c, i) => (
          <CardItem
            card={c}
            key={c.id}
            onChange={handleCardItemChange}
            onCheckboxChange={handleCardItemCheckboxChange}
            onDelete={handleDelete}
            onSwap={handleSwap}
            selected={checkboxStates[i]}
          />
        ))}
        <Divider />
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
