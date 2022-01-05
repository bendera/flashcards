import { Button, Checkbox } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FC } from 'react';
import { CardListItemData } from '../CardItemList/CardItemList';
import styles from './BatchEditToolbar.module.css';

const selectNone = (cards: CardListItemData[]) =>
  cards.map((c) => ({ ...c, selected: false }));

const selectAll = (cards: CardListItemData[]) =>
  cards.map((c) => ({ ...c, selected: true }));

const swapSelected = (cards: CardListItemData[]) =>
  cards.map((c) => {
    const { id, frontSide, backSide, selected } = c;

    if (!selected) {
      return c;
    }

    return {
      id,
      frontSide: backSide,
      backSide: frontSide,
      selected,
    };
  });

const deleteSelected = (cards: CardListItemData[]) =>
  cards.filter((c) => !c.selected);

interface BatchEditToolbarProps {
  onChange: (cards: CardListItemData[]) => void;
  cards: CardListItemData[];
}

const BatchEditToolbar: FC<BatchEditToolbarProps> = ({ cards, onChange }) => {
  const allSelected = cards.every((c) => c.selected);
  const noneSelected = cards.every((c) => !c.selected);
  const mixed = !allSelected && !noneSelected;
  const checked = mixed || allSelected;
  const buttonsDisabled = !(mixed || allSelected);

  const handleCheckboxChange = () => {
    if (mixed) {
      onChange(selectNone(cards));
    } else if (allSelected) {
      onChange(selectNone(cards));
    } else {
      onChange(selectAll(cards));
    }
  };

  return (
    <div className={styles.root}>
      <Checkbox
        checked={checked}
        className={styles.checkbox}
        indeterminate={mixed}
        onChange={handleCheckboxChange}
      />
      <Button
        disabled={buttonsDisabled}
        icon={IconNames.SWAP_HORIZONTAL}
        minimal
        onClick={() => {
          onChange(swapSelected(cards));
        }}
      >
        Swap selected
      </Button>
      <Button
        disabled={buttonsDisabled}
        icon={IconNames.TRASH}
        minimal
        onClick={() => {
          onChange(deleteSelected(cards));
        }}
      >
        Delete selected
      </Button>
    </div>
  );
};

export default BatchEditToolbar;
