import { FC, useRef, useState } from 'react';
import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import noop from 'utils/noop';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import { useAppDispatch } from 'app/hooks';
import {
  deleteCatalogItem,
  fetchCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import { deleteDeck } from 'features/deck/thunks';
import Options from './Options/Options';
import EditDeck from './EditDeck/EditDeck';
import ListDecks from './ListDecks/ListDecks';
import styles from './Settings.module.css';

export type SettingsView = 'decks' | 'options' | 'edit deck';

interface SettingsProps {
  activeView?: SettingsView;
  onComplete?: () => void;
}

const Settings: FC<SettingsProps> = ({
  activeView = 'decks',
  onComplete = noop,
}) => {
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
              active={view === 'options'}
              className={styles.button}
              onClick={() => {
                setView('options');
              }}
              text="Options"
            />
          </ButtonGroup>
          {view === 'decks' && (
            <ListDecks
              onCreate={handleCreate}
              onComplete={() => onComplete()}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          {view === 'options' && <Options />}
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
