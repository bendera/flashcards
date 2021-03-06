import { Button, Drawer, DrawerSize } from '@blueprintjs/core';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { changeView } from 'features/navigation/navigationSlice';
import { selectCurrentView } from 'features/navigation/selectors';
import Settings from 'components/Settings/Settings';
import StudySession from 'components/StudySession/StudySession';
import styles from './App.module.css';
import { DialogProvider } from 'utils/dialogs/DialogProvider';

function App() {
  const dispatch = useAppDispatch();
  const view = useAppSelector(selectCurrentView);

  const onOpenOverlayClick = () => {
    dispatch(changeView('settings/deck/list'));
  };

  const onModalClose = () => {
    dispatch(changeView('study_session'));
  };

  const handleCreateDeck = () => {
    dispatch(changeView('settings/deck/edit'));
  };

  const classes = cn(styles.App);

  return (
    <DialogProvider>
      <div className={classes}>
        <Button
          icon="menu"
          onClick={onOpenOverlayClick}
          minimal
          className={styles.menuButton}
        />
        <StudySession onCreateDeck={handleCreateDeck} />
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
