import {
  FC,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Button, EditableText, Intent } from '@blueprintjs/core';
import cn from 'classnames';

import FlashcardsAPI, { DeckCatalogItem, DeckItem } from 'utils/FlashcardsAPI';

import ImportCards from './ImportCards/ImportCards';
import styles from './EditDeck.module.css';
import CardItemList, {
  CardItemListOperation,
  CardListItemData,
} from './CardItemList/CardItemList';
import { FlashCard } from 'types';
import { useAppDispatch } from 'app/hooks';
import { updateCatalogItem } from 'features/deckCatalog/deckCatalogSlice';
import {
  fetchActiveDeck,
  saveDeck,
  startNextSession,
} from 'features/deck/deckSlice';

type DeckMetaData = Omit<DeckItem, 'id' | 'title' | 'cards'>;

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
  onEditFinished: () => void;
  /**
   * Reference to ancestor element to scroll
   */
  ancestorElementRef?: RefObject<HTMLElement>;
}

const EditDeck: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
  onEditFinished,
  ancestorElementRef = null,
}) => {
  const { active, id, title } = deckToEdit;

  const dispatch = useAppDispatch();
  const [cards, setCards] = useState<CardListItemData[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [deckTitle, setDeckTitle] = useState(title);
  const deckMetaDataRef = useRef<DeckMetaData>({
    cardsByBoxes: {},
    drawCounter: 0,
    sessionCounter: 0,
    sessionFinished: false,
    numberOfSessionCards: 0,
    lastCard: '',
  });
  const isSaveButtonActive = deckTitle.length > 0 && cards.length > 0;

  const handleTitleChange = (value: string) => {
    setDeckTitle(value);
  };

  const handleSave = async () => {
    if (active === 1) {
      const ids = cards.map((c) => c.id);
      deckMetaDataRef.current.drawCounter = 1;
      deckMetaDataRef.current.sessionCounter = 0;
      deckMetaDataRef.current.sessionFinished = false;
      deckMetaDataRef.current.lastCard = ids[0];
      deckMetaDataRef.current.cardsByBoxes = {};

      ids.forEach((id) => {
        deckMetaDataRef.current.cardsByBoxes[id] = 1;
      });
    }

    const {
      cardsByBoxes,
      drawCounter,
      sessionCounter,
      sessionFinished,
      lastCard,
      numberOfSessionCards,
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
        cards: cards.map(({ id, frontSide, backSide }) => ({
          id,
          frontSide,
          backSide,
        })),
        cardsByBoxes,
        drawCounter,
        sessionCounter,
        sessionFinished,
        numberOfSessionCards,
        title: deckTitle,
        lastCard,
      })
    );
    await dispatch(fetchActiveDeck());
    dispatch(startNextSession());
    onEditFinished();
  };

  const handleCancel = () => {
    onEditFinished();
  };

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
        numberOfSessionCards,
      } = res.data;

      deckMetaDataRef.current = {
        cardsByBoxes,
        drawCounter,
        sessionCounter,
        sessionFinished,
        lastCard,
        numberOfSessionCards,
      };
      setDeckTitle(title);
      setCards(cards.map((c) => ({ ...c, selected: false })));
    } else {
      const cardsByBoxes: { [key: string]: number } = {};

      cards.forEach(({ id }) => {
        cardsByBoxes[id] = 1;
      });

      deckMetaDataRef.current.cardsByBoxes = cardsByBoxes;
    }
  };

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckToEdit]);

  useLayoutEffect(() => {
    if (shouldScroll && ancestorElementRef?.current) {
      ancestorElementRef.current.scrollTop =
        ancestorElementRef.current.scrollHeight;
      setShouldScroll(false);
    }
  }, [ancestorElementRef, shouldScroll]);

  const handleCardItemListChange = (
    cards: CardListItemData[],
    operation?: CardItemListOperation
  ) => {
    setCards(cards);

    if (operation === 'add') {
      setShouldScroll(true);
    }
  };

  const handleImport = (imported: FlashCard[]) => {
    const importedWithSelectedFlag = imported.map((c) => ({
      ...c,
      selected: false,
    }));
    setCards([...cards, ...importedWithSelectedFlag]);

    imported.forEach((c) => {
      deckMetaDataRef.current.cardsByBoxes[c.id] = 1;
    });
  };

  return (
    <div>
      <h1 className={cn('bp3-heading', styles.heading)}>
        <EditableText
          onChange={handleTitleChange}
          placeholder="Edit title..."
          value={deckTitle}
        />
      </h1>
      <ImportCards onImport={handleImport} />
      <CardItemList cards={cards} onChange={handleCardItemListChange} />
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          disabled={!isSaveButtonActive}
          intent={Intent.PRIMARY}
          large
          onClick={handleSave}
        >
          Save deck
        </Button>
        <Button className={styles.button} large minimal onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditDeck;
