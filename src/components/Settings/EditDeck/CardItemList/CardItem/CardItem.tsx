import { ChangeEvent, FC, FormEvent } from 'react';
import { Button, Checkbox, FormGroup, TextArea } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import cn from 'classnames';
import noop from 'utils/noop';
import { CardListItemData } from '../CardItemList';
import styles from './CardItem.module.css';

interface CardItemProps {
  card: CardListItemData;
  className?: string;
  onChange?: (item: CardListItemData) => void;
  onDelete?: (card: CardListItemData) => void;
}

const CardItem: FC<CardItemProps> = ({
  card,
  className,
  onChange = noop,
  onDelete = noop,
}) => {
  const { id, frontSide, backSide, selected } = card;

  const handleCheckboxChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    if (target.type === 'checkbox') {
      onChange({
        id,
        frontSide,
        backSide,
        selected: target.checked,
      });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget as HTMLTextAreaElement;
    const val = el.value;
    const payload: CardListItemData = {
      id,
      frontSide,
      backSide,
      selected,
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
    onDelete(card);
  };

  const handleSwap = () => {
    onChange({
      id,
      frontSide: backSide,
      backSide: frontSide,
      selected,
    });
  };

  return (
    <div className={cn(styles.root, className)}>
      <Checkbox
        checked={selected}
        className={styles.checkbox}
        data-testid="CardItem__checkbox"
        onChange={handleCheckboxChange}
        value={id}
      />
      <FormGroup
        className={styles.formGroup}
        label="Front side"
        labelFor={`f_${id}`}
      >
        <TextArea
          className={styles.textarea}
          fill
          growVertically
          id={`f_${id}`}
          onChange={handleChange}
          defaultValue={frontSide}
        />
      </FormGroup>
      <Button
        className={styles.swapButton}
        icon={IconNames.SWAP_HORIZONTAL}
        minimal
        onClick={handleSwap}
        title="Swap sides"
      ></Button>
      <FormGroup
        className={styles.formGroup}
        label="Back side"
        labelFor={`b_${id}`}
      >
        <TextArea
          id={`b_${id}`}
          growVertically
          fill
          onChange={handleChange}
          defaultValue={backSide}
          className={styles.textarea}
        />
      </FormGroup>
      <Button
        className={styles.deleteButton}
        icon={IconNames.TRASH}
        minimal
        onClick={handleDelete}
        title="Delete card"
      ></Button>
    </div>
  );
};

export default CardItem;
