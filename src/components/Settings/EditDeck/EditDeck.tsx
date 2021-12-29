import { FC, useEffect, useRef, useState } from 'react';
import { Button, EditableText } from '@blueprintjs/core';
import { nanoid } from 'nanoid';

import { FlashCard } from 'types';
import { useAppDispatch } from 'app/hooks';
import { saveDeck } from 'features/deck/deckSlice';
import FlashcardsAPI, { DeckCatalogItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import { updateCatalogItem } from 'features/deckCatalog/deckCatalogSlice';
import styles from './EditDeck.module.css';

const createAnEmptyCard = (): FlashCard => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
  };
};

interface DeckMetaData {
  cardsByBoxes: {
    [key: string]: number;
  };
  drawCounter: number;
  sessionCounter: number;
}

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
}

const EditDeck: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
}) => {
  const { active, id, title } = deckToEdit;
  const emptyCard = createAnEmptyCard();
  const dispatch = useAppDispatch();
  const [deckTitle, setDeckTitle] = useState(title);
  const [cards, setCards] = useState<FlashCard[]>([emptyCard]);
  const deckMetaDataRef = useRef<DeckMetaData>({
    cardsByBoxes: {
      [emptyCard.id]: 1,
    },
    drawCounter: 0,
    sessionCounter: 0,
  });

  const handleAddCardClick = () => {
    const newCard = createAnEmptyCard();

    setCards([...cards, newCard]);
    deckMetaDataRef.current.cardsByBoxes[newCard.id] = 1;
  };

  const handleImport = (imported: FlashCard[]) => {
    setCards([...cards, ...imported]);

    imported.forEach((c) => {
      deckMetaDataRef.current.cardsByBoxes[c.id] = 1;
    });
  };

  const handleCardItemChange = (card: FlashCard) => {
    const newCards = cards.map((c) => {
      if (c.id !== card.id) {
        return c;
      }

      return card;
    });

    setCards(newCards);
  };

  const handleSave = async () => {
    const { cardsByBoxes, drawCounter, sessionCounter } =
      deckMetaDataRef.current;

    await dispatch(
      updateCatalogItem({
        id,
        title: deckTitle,
        active,
      })
    );
    await dispatch(
      saveDeck({
        id,
        cards,
        cardsByBoxes,
        drawCounter,
        sessionCounter,
        title: deckTitle,
      })
    );
  };

  const handleTitleChange = (value: string) => {
    setDeckTitle(value);
  };

  useEffect(() => {
    const fetchDeck = async () => {
      const api = new FlashcardsAPI();
      const res = await api.getDeck(deckToEdit.id);

      if (res.data) {
        const { cards, cardsByBoxes, drawCounter, sessionCounter, title } =
          res.data;

        deckMetaDataRef.current = {
          cardsByBoxes,
          drawCounter,
          sessionCounter,
        };
        setDeckTitle(title);
        setCards(cards);
      } else {
        const cardsByBoxes: { [key: string]: number } = {};

        cards.forEach(({ id }) => {
          cardsByBoxes[id] = 1;
        });

        deckMetaDataRef.current.cardsByBoxes = cardsByBoxes;
      }
    };

    fetchDeck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckToEdit]);

  return (
    <div>
      <h1 className="bp3-heading">
        <EditableText
          onChange={handleTitleChange}
          placeholder="Edit title..."
          value={deckTitle}
        />
      </h1>
      <ImportCards onImport={handleImport} />
      <div className={styles.cards}>
        {cards.map((c) => (
          <CardItem card={c} key={c.id} onChange={handleCardItemChange} />
        ))}
      </div>
      <Button onClick={handleAddCardClick}>Add card</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default EditDeck;
