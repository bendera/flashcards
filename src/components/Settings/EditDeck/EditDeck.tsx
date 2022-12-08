import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, EditableText } from '@blueprintjs/core';
import cn from 'classnames';
import { IconNames } from '@blueprintjs/icons';

import FlashcardsAPI, { DeckCatalogItem, DeckItem } from 'utils/FlashcardsAPI';
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
import SettingsPage from '../SettingsPage';
import EditDeckButtons from './EditDeckButtons/EditDeckButtons';
import ImportCards from './ImportCards/ImportCards';
import styles from './EditDeck.module.css';
import ExportCards from './ExportCards/ExportCards';

type DeckMetaData = Omit<DeckItem, 'id' | 'title' | 'cards'>;

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
  onCancel: () => void;
}

const EditDeck: FC<EditDecksProps> = ({
  deckToEdit = { id: '', title: '', active: 0 },
  onCancel,
}) => {
  const { active, id, title } = deckToEdit;

  const dispatch = useAppDispatch();
  const [dirty, setDirty] = useState(false);
  const [cards, setCards] = useState<CardListItemData[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [deckTitle, setDeckTitle] = useState(title);
  const [showImportCardsDialog, setShowImportCardsDialog] = useState(false);
  const [showExportCardsDialog, setShowExportCardsDialog] = useState(false);
  const deckMetaDataRef = useRef<DeckMetaData>({
    cardsByBoxes: {},
    drawCounter: 0,
    sessionCounter: 0,
    sessionFinished: false,
    numberOfSessionCards: 0,
    lastCard: '',
  });
  const settingsPageRef = useRef<HTMLDivElement>(null);
  const isSaveButtonActive = deckTitle.length > 0 && cards.length > 0 && dirty;

  const handleTitleChange = (value: string) => {
    setDeckTitle(value);
    setDirty(true);
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
    setDirty(false);
  };

  const handleCancel = () => {
    onCancel();
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
    if (shouldScroll && settingsPageRef?.current) {
      settingsPageRef.current.scrollTop = settingsPageRef.current.scrollHeight;
      setShouldScroll(false);
    }
  }, [settingsPageRef, shouldScroll]);

  const handleCardItemListChange = (
    cards: CardListItemData[],
    operation?: CardItemListOperation
  ) => {
    setCards(cards);
    setDirty(true);

    if (operation === 'add') {
      setShouldScroll(true);
    }
  };

  const handleImportButtonClick = () => {
    setShowImportCardsDialog(true);
  };

  const handleExportButtonClick = () => {
    setShowExportCardsDialog(true);
  };

  const handleImport = (imported: FlashCard[]) => {
    const importedWithSelectedFlag = imported.map((c) => ({
      ...c,
      selected: false,
    }));
    setCards([...cards, ...importedWithSelectedFlag]);
    setDirty(true);

    imported.forEach((c) => {
      deckMetaDataRef.current.cardsByBoxes[c.id] = 1;
    });
  };

  const handleImportDialogClose = () => {
    setShowImportCardsDialog(false);
  };

  const handleExportDialogClose = () => {
    setShowExportCardsDialog(false);
  };

  return (
    <SettingsPage
      ref={settingsPageRef}
      footerContent={
        <EditDeckButtons
          onSave={handleSave}
          onCancel={handleCancel}
          isSaveButtonActive={isSaveButtonActive}
        />
      }
    >
      <h1 className={cn('bp4-heading', styles.heading)}>
        <EditableText
          onChange={handleTitleChange}
          placeholder="Edit title..."
          value={deckTitle}
        />
      </h1>
      <div className={styles.buttons}>
        <Button icon={IconNames.IMPORT} onClick={handleImportButtonClick}>
          Import cards
        </Button>
        <Button icon={IconNames.EXPORT} onClick={handleExportButtonClick}>
          Export cards
        </Button>
      </div>
      <ImportCards
        show={showImportCardsDialog}
        onImport={handleImport}
        onClose={handleImportDialogClose}
      />
      <ExportCards
        cards={cards}
        deckTitle={deckTitle}
        show={showExportCardsDialog}
        onClose={handleExportDialogClose}
      />
      <CardItemList cards={cards} onChange={handleCardItemListChange} />
    </SettingsPage>
  );
};

export default EditDeck;
