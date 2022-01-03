import { FC, useRef, useState } from 'react';
import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import { useAppDispatch } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import {
  deleteCatalogItem,
  fetchCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import { deleteDeck } from 'features/deck/thunks';
import EditCards from './EditCards/EditCards';
import EditDeck from './EditDeck/EditDeck';
import ListDecks from './ListDecks/ListDecks';
import styles from './Settings.module.css';

export type SettingsView = 'decks' | 'ui settings' | 'edit deck';

interface SettingsProps {
  activeView?: SettingsView;
}

const Settings: FC<SettingsProps> = ({ activeView = 'decks' }) => {
  const drawerBodyRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [view, setView] = useState<SettingsView>(activeView);
  const [deckToEdit, setDeckToEdit] = useState<DeckCatalogItem>();

  const handleEdit = (item: DeckCatalogItem) => {
    setDeckToEdit(item);
    setView('edit deck');
  };

  const handleDelete = async (item: DeckCatalogItem) => {
    await dispatch(deleteCatalogItem(item.id));
    await dispatch(deleteDeck(item.id));
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

  const handleEditFinished = () => {
    setView('decks');
  };

  return (
    <>
      <div className={Classes.DRAWER_BODY} ref={drawerBodyRef}>
        <div className={Classes.DIALOG_BODY}>
          <ButtonGroup large minimal className={styles.nav}>
            <Button
              active={view === 'decks' || view === 'edit deck'}
              className={styles.button}
              onClick={() => {
                setView('decks');
              }}
              text="Decks"
            />
            <Button
              active={view === 'ui settings'}
              className={styles.button}
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
          {view === 'edit deck' && (
            <EditDeck
              deckToEdit={deckToEdit}
              onEditFinished={handleEditFinished}
              ancestorElementRef={drawerBodyRef}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
