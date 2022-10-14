import { FC } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import styles from './EditDeckButtons.module.css';

interface EditDeckButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaveButtonActive: boolean;
}

const EditDeckButtons: FC<EditDeckButtonsProps> = ({
  onSave,
  onCancel,
  isSaveButtonActive,
}) => {
  return (
    <div className={styles.root}>
      <Button
        className={styles.button}
        disabled={!isSaveButtonActive}
        intent={Intent.PRIMARY}
        large
        onClick={onSave}
      >
        Save deck
      </Button>
      <Button className={styles.button} large minimal onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default EditDeckButtons;
