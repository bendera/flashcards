import { FC, SyntheticEvent, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { nanoid } from 'nanoid';
import { FlashCard } from 'types';
import { DeckCatalogItem } from 'utils/FlashcardsAPI';
import ImportCards from './ImportCards/ImportCards';
import CardItem from './CardItem.tsx/CardItem';
import styles from './EditDecks.module.css';
import { Select } from '@blueprintjs/select';
import SimpleSelect, {
  SimpleSelectOption,
} from 'components/SimpleSelect/SimpleSelect';

const createAnEmptyCard = (): FlashCard => {
  return {
    id: nanoid(),
    frontSide: '',
    backSide: '',
  };
};

interface DeckInfo {
  id: string;
  title: string;
}

const DeckSelect = Select.ofType<DeckInfo>();

interface EditDecksProps {
  deckToEdit?: DeckCatalogItem;
}

const EditDecks: FC<EditDecksProps> = ({ deckToEdit }) => {
  const [cards, setCards] = useState<FlashCard[]>([createAnEmptyCard()]);
  const [deckTitles, setDeckTitles] = useState<DeckInfo[]>([]);
  const [selectOptions, setSelectOptions] = useState<SimpleSelectOption[]>([
    { label: 'Lorem', value: '1' },
    { label: 'Ipsum', value: '2' },
  ]);

  const handleAddCardClick = () => {
    setCards([...cards, createAnEmptyCard()]);
  };

  const handleSelectChange = (item: SimpleSelectOption) => {
    const exists =
      selectOptions.findIndex((o) => o.value === item.value) !== -1;

    console.log(exists);

    if (!exists) {
      setSelectOptions([...selectOptions, item]);
    }
  };

  return (
    <div>
      <h1 className="bp3-heading">Irregular verbs</h1>
      <ImportCards />
      <div className={styles.cards}>
        {cards.map((c) => (
          <CardItem card={c} key={c.id} />
        ))}
      </div>
      <Button onClick={handleAddCardClick}>Add card</Button>
    </div>
  );
};

export default EditDecks;
