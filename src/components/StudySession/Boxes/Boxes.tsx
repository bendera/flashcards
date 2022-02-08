import { Icon, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import {
  selectCardsByBoxes,
  selectNumberOfCardsByBoxes,
  selectUsedBoxes,
} from 'features/deck/selectors';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import styles from './Boxes.module.css';

interface BoxesProps {
  className?: string;
}

const Boxes: FC<BoxesProps> = ({ className }) => {
  const rootClasses = cn(styles.root, className);
  const cardsByBoxes = useSelector(selectNumberOfCardsByBoxes);
  const usedBoxes = useSelector(selectUsedBoxes);

  console.log(usedBoxes);

  return (
    <div className={rootClasses}>
      {cardsByBoxes.map((numCards, i) => (
        <div
          key={i}
          className={cn({
            [styles.box]: true,
            [styles.active]: usedBoxes.includes(i + 1),
          })}
        >
          <Icon icon={IconNames.INBOX} size={40} className={styles.icon} />
          {numCards > 0 ? (
            <Tag round intent="primary" className={styles.badge}>
              {numCards}
            </Tag>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Boxes;
