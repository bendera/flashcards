import { Button, Card, Elevation, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FC } from 'react';
import styles from './DeckListItemCard.module.css';

interface DeckListItemCardProps {
  id: string;
  title: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
}

const DeckListItemCard: FC<DeckListItemCardProps> = ({
  id,
  title,
  onEdit,
  onDelete,
  selected,
}) => {
  return (
    <div className={styles.wrapper}>
      <Card
        className={styles.card}
        elevation={Elevation.TWO}
        interactive
        key={id}
      >
        {selected && (
          <Tag intent={Intent.SUCCESS} className={styles.tag}>
            Selected
          </Tag>
        )}
        {title}
      </Card>
      <div className={styles.actions}>
        <Button
          icon={IconNames.EDIT}
          minimal
          onClick={() => {
            onEdit(id);
          }}
          text="Edit"
        />
        <Button
          icon={IconNames.TRASH}
          minimal
          onClick={() => {
            onDelete(id);
          }}
          text="Delete"
        />
      </div>
    </div>
  );
};

export default DeckListItemCard;
