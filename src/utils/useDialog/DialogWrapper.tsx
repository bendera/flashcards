import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import React, { FC } from 'react';

interface DialogWrapperProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

const DialogWrapper: FC<DialogWrapperProps> = ({
  open,
  title,
  message,
  onConfirm,
  onDismiss,
}) => {
  return (
    <Dialog
      isOpen={open}
      title="Dialog"
      onClose={() => {
        onDismiss();
      }}
    >
      <div className={Classes.DIALOG_BODY}>{message}</div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            onClick={() => {
              onConfirm();
            }}
          >
            Ok
          </Button>
          <Button
            onClick={() => {
              onDismiss();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogWrapper;
