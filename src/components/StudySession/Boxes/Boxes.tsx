import { Icon, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import {
  selectNumberOfCardsByBoxes,
  selectUsedBoxes,
} from 'features/deck/selectors';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import styles from './Boxes.module.css';
import Progress from './Progress/Progress';
import { useAppSelector } from 'app/hooks';

interface BoxesProps {
  className?: string;
}

const Boxes: FC<BoxesProps> = ({ className }) => {
  const showBoxes = useAppSelector((state) => state.options.boxes);
  const showProgress = useAppSelector((state) => state.options.progress);
  const rootClasses = cn(styles.root, className);
  const cardsByBoxes = useSelector(selectNumberOfCardsByBoxes);
  const usedBoxes = useSelector(selectUsedBoxes);

  return (
    <div className={rootClasses}>
      {showProgress && <Progress className={styles.progress} />}
      {showBoxes &&
        cardsByBoxes.map((numCards, i) => (
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
