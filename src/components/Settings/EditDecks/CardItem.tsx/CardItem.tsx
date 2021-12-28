import { FC } from 'react';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FlashCard } from 'types';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: FlashCard;
}

const CardItem: FC<CardItemProps> = ({ card }) => {
  const { id, frontSide, backSide } = card;

  return (
    <div className={styles.wrapper}>
      <FormGroup
        labelFor={`f_${id}`}
        label="Front side"
        className={styles.formGroup}
      >
        <InputGroup id={`f_${id}`} />
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
        <InputGroup id={`b_${id}`} />
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
