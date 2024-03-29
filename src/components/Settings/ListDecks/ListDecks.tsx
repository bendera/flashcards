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
import { fetchActiveDeck, startNextSession } from 'features/deck/deckSlice';
import DeckListItemCard from './DeckListItemCard';
import styles from './ListDecks.module.css';
import { useConfirm } from 'utils/dialogs';
import SettingsPage from '../SettingsPage';

interface ListDecksProps {
  onEdit: (item: DeckCatalogItem) => void;
  onDelete: (item: DeckCatalogItem) => void;
  onReset: (deckId: string) => void;
  onCreate: () => void;
  onComplete: () => void;
}

const ListDecks: FC<ListDecksProps> = ({
  onEdit,
  onDelete,
  onReset,
  onCreate,
}) => {
  const confirm = useConfirm();
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

  const handleReset = async (id: string) => {
    const confirmed = await confirm('Are you sure want to reset this deck?');

    if (!confirmed) {
      return;
    }

    onReset(id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Are you sure want to delete this deck?');

    if (!confirmed) {
      return;
    }

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
    }
  };

  const handleAddNew = () => {
    onCreate();
  };

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  return (
    <SettingsPage>
      <div className={styles.wrapper}>
        {decks.map(({ id, title, active }) => (
          <DeckListItemCard
            key={id}
            id={id}
            title={title}
            onActive={handleActive}
            onEdit={handleEdit}
            onReset={handleReset}
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
    </SettingsPage>
  );
};

export default ListDecks;
