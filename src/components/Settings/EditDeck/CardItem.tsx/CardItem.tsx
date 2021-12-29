import { ChangeEvent, FC, useState } from 'react';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FlashCard } from 'types';
import noop from 'utils/noop';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: FlashCard;
  onChange?: (card: FlashCard) => void;
}

const CardItem: FC<CardItemProps> = ({ card, onChange = noop }) => {
  const { id, frontSide, backSide } = card;
  const [frontSideVal, setFrontSideVal] = useState(frontSide);
  const [backSideVal, setBackSideVal] = useState(backSide);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const el = event.currentTarget as HTMLInputElement;
    const val = el.value;
    const payload: FlashCard = {
      id,
      frontSide: frontSideVal,
      backSide: backSideVal,
    };

    switch (el.id) {
      case `f_${id}`:
        setFrontSideVal(val);
        payload.frontSide = val;
        break;
      case `b_${id}`:
        setBackSideVal(val);
        payload.backSide = val;
        break;
    }

    onChange(payload);
  };

  return (
    <div className={styles.wrapper}>
      <FormGroup
        labelFor={`f_${id}`}
        label="Front side"
        className={styles.formGroup}
      >
        <InputGroup
          id={`f_${id}`}
          onInput={handleChange}
          value={frontSideVal}
        />
      </FormGroup>
      <Button
        icon={IconNames.SWAP_HORIZONTAL}
        minimal
        className={styles.swapButton}
      ></Button>
      <FormGroup
        labelFor={`b_${id}`}
        label="Back side"
        className={styles.formGroup}
      >
        <InputGroup id={`b_${id}`} onInput={handleChange} value={backSideVal} />
      </FormGroup>
      <Button
        icon={IconNames.TRASH}
        minimal
        className={styles.deleteButton}
      ></Button>
    </div>
  );
};

export default CardItem;
