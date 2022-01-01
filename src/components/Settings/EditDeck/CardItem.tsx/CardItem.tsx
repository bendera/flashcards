import { ChangeEvent, FC, useState } from 'react';
import { Button, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FlashCard } from 'types';
import noop from 'utils/noop';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: FlashCard;
  onChange?: (card: FlashCard) => void;
  onDelete?: (id: string) => void;
  onSwap?: (card: FlashCard) => void;
}

const CardItem: FC<CardItemProps> = ({
  card,
  onChange = noop,
  onDelete = noop,
  onSwap = noop,
}) => {
  const { id, frontSide, backSide } = card;

  const handleChange = (event: any) => {
    const el = event.currentTarget as HTMLInputElement;
    const val = el.value;
    const payload: FlashCard = {
      id,
      frontSide,
      backSide,
    };

    switch (el.id) {
      case `f_${id}`:
        payload.frontSide = val;
        break;
      case `b_${id}`:
        payload.backSide = val;
        break;
    }

    onChange(payload);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleSwap = () => {
    onSwap(card);
  };

  return (
    <div className={styles.wrapper}>
      <FormGroup
        className={styles.formGroup}
        label="Front side"
        labelFor={`f_${id}`}
      >
        {/* <InputGroup
          id={`f_${id}`}
          onInput={handleChange}
          value={frontSide}
        /> */}
        <TextArea
          id={`f_${id}`}
          onChange={handleChange}
          value={frontSide}
          fill
          growVertically
          className={styles.textarea}
        />
      </FormGroup>
      <Button
        className={styles.swapButton}
        icon={IconNames.SWAP_HORIZONTAL}
        minimal
        onClick={handleSwap}
      ></Button>
      <FormGroup
        className={styles.formGroup}
        label="Back side"
        labelFor={`b_${id}`}
      >
        <InputGroup id={`b_${id}`} onInput={handleChange} value={backSide} />
      </FormGroup>
      <Button
        className={styles.deleteButton}
        icon={IconNames.TRASH}
        minimal
        onClick={handleDelete}
      ></Button>
    </div>
  );
};

export default CardItem;
