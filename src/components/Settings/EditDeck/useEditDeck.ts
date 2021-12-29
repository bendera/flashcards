import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { FlashCard } from 'types';
import { useAppDispatch } from 'app/hooks';
import FlashcardsAPI, { DeckCatalogItem } from 'utils/FlashcardsAPI';
import { updateCatalogItem } from 'features/deckCatalog/deckCatalogSlice';
import { saveDeck } from 'features/deck/deckSlice';

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

const useEditDeck = (deckToEdit: DeckCatalogItem) => {
  const { active, id, title } = deckToEdit;
  const emptyCard = createAnEmptyCard();
  const dispatch = useAppDispatch();
  const [deckTitle, setDeckTitle] = useState(title);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const deckMetaDataRef = useRef<DeckMetaData>({
    cardsByBoxes: {
      [emptyCard.id]: 1,
    },
    drawCounter: 0,
    sessionCounter: 0,
  });

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

  const handleSwap = (card: FlashCard) => {
    const newCards = cards.map((c) => {
      if (c.id !== card.id) {
        return c;
      }

      const { id, frontSide, backSide } = card;

      return {
        id,
        frontSide: backSide,
        backSide: frontSide,
      };
    });

    setCards(newCards);
  };

  const handleDelete = (id: string) => {
    const newCards = cards.filter((c) => c.id !== id);

    setCards(newCards);
  };

  return {
    cards,
    deckTitle,
    fetchDeck,
    handleAddCardClick,
    handleCardItemChange,
    handleDelete,
    handleImport,
    handleSave,
    handleSwap,
    handleTitleChange,
  };
};

export default useEditDeck;
