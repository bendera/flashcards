import { FC } from 'react';
import { Button, Card, Elevation, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import noop from 'utils/noop';
import styles from './DeckListItemCard.module.css';

interface DeckListItemCardProps {
  active?: boolean;
  id: string;
  onActive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  title: string;
}

const DeckListItemCard: FC<DeckListItemCardProps> = ({
  active,
  id,
  onActive = noop,
  onDelete = noop,
  onEdit = noop,
  title,
}) => {
  const handleCardClick = () => {
    onActive(id);
  };

  return (
    <div className={styles.wrapper}>
      <Card
        className={styles.card}
        elevation={Elevation.TWO}
        interactive
        key={id}
        onClick={handleCardClick}
      >
        {active && (
          <Tag intent={Intent.SUCCESS} className={styles.tag}>
            Active
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
