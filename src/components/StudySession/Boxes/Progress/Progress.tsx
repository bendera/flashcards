import { FC } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import {
  selectNumberOfTotalCards,
  selectNumberOfCurrentCard,
} from 'features/deck/selectors';
import styles from './Progress.module.css';
import Gauge from './Gauge';

interface ProgressProps {
  className?: string;
}

const Progress: FC<ProgressProps> = ({ className }) => {
  const total = useSelector(selectNumberOfTotalCards);
  const current = useSelector(selectNumberOfCurrentCard);
  const classes = cn(styles.root, className);
  const percent = total === 0 ? 0 : (current / total) * 100;

  return (
    <div className={classes}>
      <div className={styles.value}>
        {current}/{total}
      </div>
      <Gauge percent={percent} />
    </div>
  );
};

export default Progress;
