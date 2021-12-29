import { FC, useState } from 'react';
import { Button, ButtonGroup, Classes } from '@blueprintjs/core';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import EditCards from './EditCards/EditCards';
import EditDecks from './EditDecks/EditDecks';
import ListDecks from './ListDecks/ListDecks';
import styles from './Settings.module.css';

type VisibleView = 'decks' | 'ui settings' | 'edit deck';

const Settings: FC = () => {
  const [view, setView] = useState<VisibleView>('decks');
  const [deckToEdit, setDeckToEdit] = useState<DeckCatalogItem>();

  const handleEdit = (item: DeckCatalogItem) => {
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
        {view === 'decks' && <ListDecks onEdit={handleEdit} />}
        {view === 'ui settings' && <EditCards />}
        {view === 'edit deck' && <EditDecks deckToEdit={deckToEdit} />}
      </div>
    </div>
  );
};

export default Settings;
