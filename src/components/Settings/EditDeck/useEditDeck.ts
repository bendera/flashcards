import {
  FormEvent,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { FlashCard } from 'types';
import { useAppDispatch } from 'app/hooks';
import FlashcardsAPI, { DeckCatalogItem, DeckItem } from 'utils/FlashcardsAPI';
import { updateCatalogItem } from 'features/deckCatalog/deckCatalogSlice';
import { saveDeck } from 'features/deck/deckSlice';
import { Command } from './BatchEditToolbar/BatchEditToolbar';

const createAnEmptyCard = (): FlashCard => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
  };
};

type DeckMetaData = Omit<DeckItem, 'id' | 'title' | 'cards'>;

const useEditDeck = (
  deckToEdit: DeckCatalogItem,
  onEditFinished: () => void,
  ancestorElementRef?: RefObject<HTMLElement> | null
) => {
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
    sessionFinished: false,
    lastCard: '',
  });
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);

  useEffect(() => {
    const newCheckboxStates = cards.map((_, i) => {
      if (checkboxStates[i]) {
        return checkboxStates[i];
      }

      return false;
    });

    setCheckboxStates(newCheckboxStates);
  }, [cards]);

  useLayoutEffect(() => {
    const scrollEl = ancestorElementRef?.current;

    if (scrollToBottom && scrollEl) {
      scrollEl.scrollTop = scrollEl.scrollHeight;
      setScrollToBottom(false);
    }
  }, [ancestorElementRef, scrollToBottom]);

  const fetchDeck = async () => {
    const api = new FlashcardsAPI();
    const res = await api.getDeck(deckToEdit.id);

    if (res.data) {
      const {
        cards,
        cardsByBoxes,
        drawCounter,
        sessionCounter,
        title,
        lastCard,
        sessionFinished,
      } = res.data;

      deckMetaDataRef.current = {
        cardsByBoxes,
        drawCounter,
        sessionCounter,
        sessionFinished,
        lastCard,
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
    setScrollToBottom(true);
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
    const {
      cardsByBoxes,
      drawCounter,
      sessionCounter,
      sessionFinished,
      lastCard,
    } = deckMetaDataRef.current;

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
        sessionFinished,
        title: deckTitle,
        lastCard,
      })
    );
    onEditFinished();
  };

  const handleCancel = () => {
    onEditFinished();
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

    delete deckMetaDataRef.current.cardsByBoxes[id];

    setCards(newCards);
  };

  const handleCardItemCheckboxChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    if (target.type === 'checkbox') {
      const index = cards.findIndex(({ id }) => id === target.value);
      const newCheckboxStates = [...checkboxStates];
      newCheckboxStates[index] = target.checked;

      setCheckboxStates(newCheckboxStates);
    }
  };

  const handleBatchEditChange = (command: Command) => {
    switch (command) {
      case 'selectAll':
        setCheckboxStates(checkboxStates.map((_) => true));
        break;
      case 'selectNone':
        setCheckboxStates(checkboxStates.map((_) => false));
        break;
      case 'swapSelected':
        {
          const newCards = cards.map((c, i) => {
            if (checkboxStates[i] === true) {
              const { id, frontSide, backSide } = c;

              return {
                id,
                frontSide: backSide,
                backSide: frontSide,
              };
            }

            return c;
          });
          setCards(newCards);
        }
        break;
      case 'deleteSelected':
        {
          const newCards = cards.filter((_, i) => checkboxStates[i] !== true);
          setCards(newCards);
          setCheckboxStates(newCards.map((_) => false));
        }
        break;
    }
  };

  return {
    cards,
    checkboxStates,
    deckTitle,
    fetchDeck,
    handleAddCardClick,
    handleBatchEditChange,
    handleCancel,
    handleCardItemChange,
    handleCardItemCheckboxChange,
    handleDelete,
    handleImport,
    handleSave,
    handleSwap,
    handleTitleChange,
  };
};

export default useEditDeck;
