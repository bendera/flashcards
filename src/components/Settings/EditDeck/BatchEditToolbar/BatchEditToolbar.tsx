import { Button, Checkbox, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FC, useEffect, useState } from 'react';
import { FlashCard } from 'types';
import styles from './BatchEditToolbar.module.css';

export type Command =
  | 'selectAll'
  | 'selectNone'
  | 'swapSelected'
  | 'deleteSelected';

interface BatchEditToolbarProps {
  onChange: (command: Command) => void;
  cards: FlashCard[];
  checkboxStates: boolean[];
}

const BatchEditToolbar: FC<BatchEditToolbarProps> = ({
  cards,
  checkboxStates,
  onChange,
}) => {
  const numChecked = checkboxStates.filter((val) => val === true).length;
  const indeterminate = numChecked !== checkboxStates.length && numChecked > 0;
  const checked = numChecked === checkboxStates.length && numChecked > 0;
  const buttonsDisabled = !(indeterminate || checked);

  const handleCheckboxChange = () => {
    if (indeterminate) {
      onChange('selectNone');
    } else if (checked) {
      onChange('selectNone');
    } else {
      onChange('selectAll');
    }
  };

  return (
    <div className={styles.root}>
      <Checkbox
        checked={checked}
        className={styles.checkbox}
        indeterminate={indeterminate}
        onChange={handleCheckboxChange}
      />
      <Button
        disabled={buttonsDisabled}
        icon={IconNames.SWAP_HORIZONTAL}
        minimal
        onClick={() => {
          onChange('swapSelected');
        }}
      >
        Swap selected
      </Button>
      <Button
        disabled={buttonsDisabled}
        icon={IconNames.TRASH}
        minimal
        onClick={() => onChange('deleteSelected')}
      >
        Delete selected
      </Button>
    </div>
  );
};

export default BatchEditToolbar;
