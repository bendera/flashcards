import { FC } from 'react';
import styles from './CounterBadge.module.css';

interface CounterBadgeProps {
  counter: number;
}

const CounterBadge: FC<CounterBadgeProps> = ({ counter }) => {
  return (
    <span className={styles.root}>{counter > 1000 ? '1K+' : counter}</span>
  );
};

export default CounterBadge;
