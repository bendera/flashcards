import { FC, useState } from 'react';
import { nanoid } from 'nanoid';
import noop from 'utils/noop';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { changeView } from 'features/navigation/navigationSlice';
import {
  deleteCatalogItem,
  fetchCatalog,
} from 'features/deckCatalog/deckCatalogSlice';
import { deleteDeck, resetDeckStats } from 'features/deck/deckSlice';
import Options from './Options/Options';
import EditDeck from './EditDeck/EditDeck';
import ListDecks from './ListDecks/ListDecks';

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
  const dispatch = useAppDispatch();
  const [deckToEdit, setDeckToEdit] = useState<DeckCatalogItem>(
    createAnEmptyDeck()
  );

  const handleEdit = (item: DeckCatalogItem) => {
    setDeckToEdit(item);
    dispatch(changeView('settings/deck/edit'));
  };

  const handleReset = (id: string) => {
    dispatch(resetDeckStats(id));
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

  const handleEditCancel = () => {
    dispatch(changeView('settings/deck/list'));
  };

  return (
    <>
      {view === 'settings/deck/list' && (
        <ListDecks
          onCreate={handleCreate}
          onComplete={() => onComplete()}
          onReset={handleReset}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      {view === 'settings/options' && <Options />}
      {view === 'settings/deck/edit' && (
        <EditDeck deckToEdit={deckToEdit} onCancel={handleEditCancel} />
      )}
    </>
  );
};

export default Settings;
