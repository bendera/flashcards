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
import { createDemoDeck, fetchActiveDeck } from 'features/deck/deckSlice';
import { fetchCatalog } from 'features/deckCatalog/deckCatalogSlice';

function App() {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCurrentView);
  const darkMode = useAppSelector((state) => state.options.data.darkMode);
  const firstRun = useAppSelector((state) => state.options.data.firstRun);
  const optionsLoaded = useAppSelector((state) => state.options.loaded);

  const onOpenOverlayClick = () => {
    dispatch(changeView('settings/deck/list'));
  };

  const onModalClose = () => {
    dispatch(changeView('study_session'));
  };

  const classes = cn(styles.App);

  // #region useEffect hooks

  useEffect(() => {
    const loadOptions = async () => {
      await dispatch(fetchAllOptions());
    };

    loadOptions();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      if (optionsLoaded) {
        if (firstRun) {
          await dispatch(createDemoDeck());
        }

        await dispatch(fetchCatalog());
        await dispatch(fetchActiveDeck());
      }
    };

    loadData();
  }, [optionsLoaded, firstRun, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('bp4-dark', darkMode);
  }, [darkMode]);

  // #endregion

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
