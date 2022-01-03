import { FC, useEffect, useState } from 'react';
import { Button, Card, Elevation, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import {
  fetchCatalog,
  selectActiveDeckId,
  selectDeckCatalogItems,
  setActiveCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import DeckListItemCard from './DeckListItemCard';
import styles from './ListDecks.module.css';
import { draw, fetchActiveDeck, startSession } from 'features/deck/deckSlice';

interface DeckListItem {
  id: string;
  title: string;
}

interface ListDecksProps {
  onEdit: (item: DeckCatalogItem) => void;
  onDelete: (item: DeckCatalogItem) => void;
  onCreate: () => void;
}

const ListDecks: FC<ListDecksProps> = ({ onEdit, onDelete, onCreate }) => {
  const dispatch = useAppDispatch();
  const decks = useAppSelector(selectDeckCatalogItems);
  const activeDeckId = useAppSelector(selectActiveDeckId);

  const deckById = (id: string) => decks.find((d) => d.id === id);

  const handleEdit = (id: string) => {
    // TODO: If the deck is an active deck, the progress statistics should be restored

    const deckToEdit = deckById(id);

    if (deckToEdit) {
      onEdit(deckToEdit);
    }
  };

  const handleDelete = (id: string) => {
    const deckToEdit = deckById(id);

    if (deckToEdit) {
      onDelete(deckToEdit);
    }
  };

  const handleActive = async (id: string) => {
    if (id !== activeDeckId) {
      await dispatch(setActiveCatalog(id));
      await dispatch(fetchCatalog());
      await dispatch(fetchActiveDeck());
      dispatch(startSession());
      dispatch(draw());
    }
  };

  const handleAddNew = () => {
    onCreate();
  };

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      {decks.map(({ id, title, active }) => (
        <DeckListItemCard
          id={id}
          title={title}
          onActive={handleActive}
          onEdit={handleEdit}
          onDelete={handleDelete}
          active={active === 1}
        />
      ))}
      <div className={styles.addNew}>
        <Button
          intent={Intent.PRIMARY}
          large
          onClick={handleAddNew}
        >
          Add new
        </Button>
      </div>
    </div>
  );
};

export default ListDecks;
