import { Icon } from '@blueprintjs/core';
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
import CounterBadge from './CounterBadge';

interface BoxesProps {
  className?: string;
}

const Boxes: FC<BoxesProps> = ({ className }) => {
  const showBoxes = useAppSelector((state) => state.options.data.boxes);
  const showProgress = useAppSelector((state) => state.options.data.progress);
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
            <Icon icon={IconNames.INBOX} size={30} className={styles.icon} />
            {numCards > 0 && <CounterBadge counter={numCards} />}
          </div>
        ))}
    </div>
  );
};

export default Boxes;
