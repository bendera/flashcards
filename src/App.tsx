import { useEffect } from 'react';
import { Button, Drawer, DrawerSize } from '@blueprintjs/core';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { DialogProvider } from 'utils/dialogs/DialogProvider';
import { changeView } from 'features/navigation/navigationSlice';
import { selectCurrentView } from 'features/navigation/selectors';
import { fetchAllOptions } from 'features/options/optionsSlice';
import Settings from 'components/Settings/Settings';
import StudySession from 'components/StudySession/StudySession';
import styles from './App.module.css';

function App() {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCurrentView);
  const darkMode = useAppSelector((state) => state.options.darkMode);

  const onOpenOverlayClick = () => {
    dispatch(changeView('settings/deck/list'));
  };

  const onModalClose = () => {
    dispatch(changeView('study_session'));
  };

  const classes = cn(styles.App);

  useEffect(() => {
    dispatch(fetchAllOptions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('bp3-dark', darkMode);
  }, [darkMode]);

  return (
    <DialogProvider>
      <div className={classes}>
        <Button
          icon="menu"
          onClick={onOpenOverlayClick}
          minimal
          className={styles.menuButton}
        />
        <StudySession />
        <Drawer
          isOpen={view.includes('settings')}
          onClose={onModalClose}
          size={DrawerSize.LARGE}
          title="Settings"
        >
          <Settings
            onComplete={() => {
              dispatch(changeView('study_session'));
            }}
          />
        </Drawer>
      </div>
    </DialogProvider>
  );
}

export default App;
