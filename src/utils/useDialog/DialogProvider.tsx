import React, { createContext, FC, useState } from 'react';
import DialogWrapper from './DialogWrapper';
import { DialogOptions } from './useDialog';

interface DialogContextData {
  openDialog: (cfg: {
    message: string;
    options: DialogOptions;
    callback: (confirmed: boolean) => void;
  }) => void;
}

export const DialogContext = createContext<DialogContextData>({
  openDialog: ({message, options, callback}) => {
    return;
  },
});

interface DialogConfig {
  message: string;
  options: DialogOptions;
  callback: (confirmed: boolean) => void;
}

const defaultDialogConfig: DialogConfig = {
  message: '',
  options: {},
  callback: (confirmed: boolean) => {
    return;
  },
};

export const DialogProvider: FC = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);

  const openDialog = ({ message, options, callback }: DialogConfig) => {
    setDialogOpen(true);
    setDialogConfig({ message, options, callback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig(defaultDialogConfig);
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.callback(true);
  };

  const onDismiss = () => {
    resetDialog();
    dialogConfig.callback(false);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      <DialogWrapper
        open={dialogOpen}
        title="Dialog"
        message={dialogConfig.message}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />
      {children}
    </DialogContext.Provider>
  );
};
