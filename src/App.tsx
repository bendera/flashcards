import { useEffect, useState } from 'react';
import { Button, Drawer, DrawerSize } from '@blueprintjs/core';
import cn from 'classnames';
import { useAppDispatch } from './app/hooks';
import { addCards, loadDeck, saveDeck } from './features/deck/deckSlice';
import Settings from './components/Settings/Settings';
import styles from './App.module.css';

import FlashcardsAPI from 'utils/api';
import { nanoid } from 'nanoid';

function App() {
  const dispatch = useAppDispatch();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const action = addCards([
      { frontSide: 'esernyő', backSide: 'umbrella' },
      { frontSide: 'osztályterem', backSide: 'classroom' },
      { frontSide: 'finom, ízletes', backSide: 'delicious' },
    ]);

    // dispatch(action);
    dispatch(loadDeck());
  }, [dispatch]);

  const onSaveDeckClick = () => {
    dispatch(saveDeck());
  };

  const onOpenOverlayClick = () => {
    setShowSettings(true);
  };

  const onModalClose = () => {
    setShowSettings(false);
  };

  const classes = cn(styles.App);

  useEffect(() => {
    async function demo() {
      const api = new FlashcardsAPI();

      /* await api.addCard({
        frontSide: 'Lorem',
        backSide: 'Ipsum',
      });
      await api.addCard({
        frontSide: 'Dolor',
        backSide: 'Sit',
      }); */
      await api.addCards([
        {
          id: nanoid(),
          frontSide: 'Lorem',
          backSide: new Date().toString(),
        },
        {
          id: nanoid(),
          frontSide: 'Ipsum',
          backSide: new Date().toString(),
        },
      ]);
      const card = await api.getCards([
        'TkTIXkXt4mMbLFi11v4Je',
        'c9MUnyGTTaDn46MDoNCch',
      ]);
    }

    demo();
  }, []);

  return (
    <div className={classes}>
      <header className="App-header">
        <button type="button" onClick={onSaveDeckClick}>
          Save deck
        </button>
        <Button
          icon="menu"
          onClick={onOpenOverlayClick}
          minimal
          className={styles.menuButton}
        />
        <Drawer
          isOpen={showSettings}
          onClose={onModalClose}
          size={DrawerSize.LARGE}
          title="Settings"
        >
          <Settings />
        </Drawer>
      </header>
    </div>
  );
}

export default App;
