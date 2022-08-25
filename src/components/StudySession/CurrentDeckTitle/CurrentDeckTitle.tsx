import React, { FC } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectCurrentDeckTitle } from 'features/deck/selectors';
import styles from './CurrentDeckTitle.module.css';

interface CurrentDeckTitleProps {
  className?: string;
}

const CurrentDeckTitle: FC<CurrentDeckTitleProps> = ({ className = '' }) => {
  const title = useSelector(selectCurrentDeckTitle);
  const classes = cn('bp3-heading', styles.root, className);

  return <h1 className={classes}>{title}</h1>;
};

export default CurrentDeckTitle;
