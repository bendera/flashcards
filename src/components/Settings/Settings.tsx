import { FC, useRef, useState } from 'react';
import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import cn from 'classnames';
import noop from 'utils/noop';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { changeView } from 'features/navigation/navigationSlice';
import {
  deleteCatalogItem,
  fetchCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import { deleteDeck } from 'features/deck/thunks';
import Options from './Options/Options';
import EditDeck from './EditDeck/EditDeck';
import ListDecks from './ListDecks/ListDecks';
import styles from './Settings.module.css';

const createAnEmptyDeck = (): DeckCatalogItem => ({
  id: nanoid(),
  title: '',
  active: 0,
});

export type SettingsView = 'decks' | 'options' | 'edit deck';

interface SettingsProps {
  onComplete?: () => void;
}

const Settings: FC<SettingsProps> = ({ onComplete = noop }) => {
  const view = useAppSelector((state) => state.navigation.currentView);
  const drawerBodyRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [deckToEdit, setDeckToEdit] = useState<DeckCatalogItem>(createAnEmptyDeck());

  const handleEdit = (item: DeckCatalogItem) => {
    setDeckToEdit(item);
    dispatch(changeView('settings/deck/edit'));
  };

  const handleDelete = async (item: DeckCatalogItem) => {
    await dispatch(deleteCatalogItem(item.id));
    await dispatch(deleteDeck(item.id));
    dispatch(fetchCatalog());
  };

  const handleCreate = () => {
    const item = createAnEmptyDeck();

    setDeckToEdit(item);
    dispatch(changeView('settings/deck/edit'));
  };

  const handleEditFinished = () => {
    dispatch(changeView('settings/deck/list'));
  };

  return (
    <>
      <div className={Classes.DRAWER_BODY} ref={drawerBodyRef}>
        <div className={Classes.DIALOG_BODY}>
          <ButtonGroup minimal className={styles.nav}>
            <Button
              active={
                view === 'settings/deck/edit' || view === 'settings/deck/list'
              }
              className={styles.button}
              onClick={() => {
                dispatch(changeView('settings/deck/list'));
              }}
              text="Decks"
            />
            <Button
              active={view === 'settings/options'}
              className={styles.button}
              onClick={() => {
                dispatch(changeView('settings/options'));
              }}
              text="Options"
            />
          </ButtonGroup>
          {view === 'settings/deck/list' && (
            <ListDecks
              onCreate={handleCreate}
              onComplete={() => onComplete()}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          {view === 'settings/options' && <Options />}
          {view === 'settings/deck/edit' && (
            <EditDeck
              deckToEdit={deckToEdit}
              onEditFinished={handleEditFinished}
              ancestorElementRef={drawerBodyRef}
            />
          )}
        </div>
      </div>
      <div className={cn(Classes.DRAWER_FOOTER, styles.footer)}>
        <Button
          onClick={() => {
            onComplete();
          }}
        >
          Done
        </Button>
      </div>
    </>
  );
};

export default Settings;
