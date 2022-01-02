import { useEffect, useState } from 'react';
import { Button, Drawer, DrawerSize } from '@blueprintjs/core';
import cn from 'classnames';
import { useAppDispatch } from './app/hooks';
import { fetchActiveDeck } from './features/deck/deckSlice';
import Settings, { SettingsView } from 'components/Settings/Settings';
import StudySession from 'components/StudySession/StudySession';
import styles from './App.module.css';

function App() {
  const dispatch = useAppDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsView, setActiveSettingsView] =
    useState<SettingsView>('ui settings');

  const onOpenOverlayClick = () => {
    setShowSettings(true);
  };

  const onModalClose = () => {
    setShowSettings(false);
  };

  const classes = cn(styles.App);

  /* useEffect(() => {
    dispatch(fetchActiveDeck());
  }, [dispatch]); */

  const handleCreateDeck = () => {
    setActiveSettingsView('decks');
    setShowSettings(true);
  };

  const handleSelectActiveDeck = () => {};

  return (
    <div className={classes}>
      <Button
        icon="menu"
        onClick={onOpenOverlayClick}
        minimal
        className={styles.menuButton}
      />
      <StudySession
        onCreateDeck={handleCreateDeck}
        onSelectActiveDeck={handleSelectActiveDeck}
      />
      <Drawer
        isOpen={showSettings}
        onClose={onModalClose}
        size={DrawerSize.LARGE}
        title="Settings"
      >
        <Settings activeView={activeSettingsView} />
      </Drawer>
    </div>
  );
}

export default App;
