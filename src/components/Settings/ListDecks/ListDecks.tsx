import { FC, useEffect } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import {
  fetchCatalog,
  selectActiveDeckId,
  selectDeckCatalogItems,
  setActiveCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import {
  draw,
  fetchActiveDeck,
  startNextSession,
} from 'features/deck/deckSlice';
import DeckListItemCard from './DeckListItemCard';
import styles from './ListDecks.module.css';

interface ListDecksProps {
  onEdit: (item: DeckCatalogItem) => void;
  onDelete: (item: DeckCatalogItem) => void;
  onCreate: () => void;
  onComplete: () => void;
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
      dispatch(startNextSession());
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
      <div className={styles.buttons}>
        <Button
          className={styles.buttonAdd}
          intent={Intent.PRIMARY}
          large
          onClick={handleAddNew}
        >
          Add new deck
        </Button>
      </div>
    </div>
  );
};

export default ListDecks;
