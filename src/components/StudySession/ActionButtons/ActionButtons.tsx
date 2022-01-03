import { FC } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  onPromote: () => void;
  onDemote: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ onPromote, onDemote }) => {
  return (
    <div className={styles.root}>
      <Button
        className={styles.button}
        icon={IconNames.CROSS}
        intent={Intent.DANGER}
        large
        minimal
        onClick={onDemote}
      >
        Don't know
      </Button>
      <Button
        className={styles.button}
        icon={IconNames.TICK}
        intent={Intent.SUCCESS}
        large
        minimal
        onClick={onPromote}
      >
        Know
      </Button>
    </div>
  );
};

export default ActionButtons;
