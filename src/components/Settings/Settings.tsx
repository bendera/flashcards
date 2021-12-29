import { FC, useState } from 'react';
import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import { useAppDispatch } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import {
  deleteCatalogItem,
  fetchCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import EditCards from './EditCards/EditCards';
import EditDecks from './EditDecks/EditDecks';
import ListDecks from './ListDecks/ListDecks';
import styles from './Settings.module.css';

type VisibleView = 'decks' | 'ui settings' | 'edit deck';

const Settings: FC = () => {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<VisibleView>('decks');
  const [deckToEdit, setDeckToEdit] = useState<DeckCatalogItem>();

  const handleEdit = (item: DeckCatalogItem) => {
    setDeckToEdit(item);
    setView('edit deck');
  };

  const handleDelete = async (item: DeckCatalogItem) => {
    await dispatch(deleteCatalogItem(item.id));
    dispatch(fetchCatalog());
  };

  const handleCreate = () => {
    const item: DeckCatalogItem = {
      id: nanoid(),
      title: '',
      active: 0,
    };

    setDeckToEdit(item);
    setView('edit deck');
  };

  return (
    <div className={Classes.DRAWER_BODY}>
      <div className={Classes.DIALOG_BODY}>
        <ButtonGroup large minimal className={styles.nav}>
          <Button
            active={view === 'decks' || view === 'edit deck'}
            onClick={() => {
              setView('decks');
            }}
            text="Decks"
          />
          <Button
            active={view === 'ui settings'}
            onClick={() => {
              setView('ui settings');
            }}
            text="UI settings"
          />
        </ButtonGroup>
        {view === 'decks' && (
          <ListDecks
            onCreate={handleCreate}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        {view === 'ui settings' && <EditCards />}
        {view === 'edit deck' && <EditDecks deckToEdit={deckToEdit} />}
      </div>
    </div>
  );
};

export default Settings;
