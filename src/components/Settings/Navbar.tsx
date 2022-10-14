import { FC } from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectCurrentView } from 'features/navigation/selectors';
import { changeView } from 'features/navigation/navigationSlice';
import styles from './Navbar.module.css';

interface NavbarProps {
  className?: string;
}

const Navbar: FC<NavbarProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCurrentView);

  return (
    <ButtonGroup minimal className={className}>
      <Button
        active={view === 'settings/deck/edit' || view === 'settings/deck/list'}
        className={styles.button}
        onClick={() => {
          dispatch(changeView('settings/deck/list'));
        }}
        text="Decks"
      />
      <Button
        active={view === 'settings/options'}
        className={styles.button}
        onClick={() => {
          dispatch(changeView('settings/options'));
        }}
        text="Options"
      />
    </ButtonGroup>
  );
};

export default Navbar;
