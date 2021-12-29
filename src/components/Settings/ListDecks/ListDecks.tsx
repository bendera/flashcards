import { FC, useEffect, useState } from 'react';
import { Button, Card, Elevation, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import {
  fetchCatalog,
  selectDeckCatalogItems,
} from 'features/deckCatalog/deckCatalogSlice';
import DeckListItemCard from './DeckListItemCard';
import styles from './ListDecks.module.css';

interface DeckListItem {
  id: string;
  title: string;
}

interface ListDecksProps {
  onEdit: (item: DeckCatalogItem) => void;
}

const ListDecks: FC<ListDecksProps> = ({ onEdit }) => {
  const dispatch = useAppDispatch();
  const decks = useAppSelector(selectDeckCatalogItems);
  const [selectedDeck, setSelectedDeck] = useState('MWUtqgKzbKYqK9Sh3CqP9');

  const handleEdit = (id: string) => {
    const deckToEdit = decks.find((d) => d.id === id);

    if (deckToEdit) {
      onEdit(deckToEdit);
    }
  };

  const handleDelete = (id: string) => {};

  useEffect(() => {
    dispatch(fetchCatalog());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      {decks.map(({ id, title, active }) => (
        <DeckListItemCard
          id={id}
          title={title}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selected={active === 1}
        />
      ))}
      <Card className={styles.addNew} elevation={Elevation.TWO}>
        <Button icon={IconNames.ADD} intent={Intent.PRIMARY} large>
          Add new
        </Button>
      </Card>
    </div>
  );
};

export default ListDecks;
