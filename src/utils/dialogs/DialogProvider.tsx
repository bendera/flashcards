import React, {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import DialogWrapper from './DialogWrapper';
import { ModalOptions } from '.';

export type DialogType = 'confirm' | 'alert' | 'prompt';

export type ConfirmDialogConfig = {
  dialogType: 'confirm';
  message: string;
  options: ModalOptions;
  callback: (confirmed: boolean) => void;
};

export type AlertDialogConfig = {
  dialogType: 'alert';
  message: string;
  options: ModalOptions;
  callback: () => void;
};

export type PromptDialogConfig = {
  dialogType: 'prompt';
  message: string;
  defaultValue: string;
  options: ModalOptions;
  callback: (value: string | null) => void;
};

export type DialogConfig =
  | ConfirmDialogConfig
  | AlertDialogConfig
  | PromptDialogConfig;

interface DialogContextData {
  openDialog: (config: DialogConfig) => void;
}

const defaultDialogConfig: DialogConfig = {
  message: '',
  options: {},
  dialogType: 'confirm',
  callback: () => {
    return;
  },
};

export const DialogContext = createContext<DialogContextData>({
  openDialog: () => {
    return;
  },
});

export const DialogProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (dialogConfig.dialogType === 'prompt' && dialogConfig.defaultValue) {
      setInputValue(dialogConfig.defaultValue);
    }
  }, [dialogConfig]);

  const openDialog = (config: DialogConfig) => {
    setDialogOpen(true);
    setDialogConfig(config);
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig(defaultDialogConfig);
  };

  const onConfirm = () => {
    resetDialog();

    switch (dialogConfig.dialogType) {
      case 'alert':
        dialogConfig.callback();
        break;
      case 'confirm':
        dialogConfig.callback(true);
        break;
      case 'prompt':
        dialogConfig.callback(inputValue);
        break;
    }
  };

  const onDismiss = () => {
    resetDialog();

    switch (dialogConfig.dialogType) {
      case 'confirm':
        dialogConfig.callback(false);
        break;
      case 'prompt':
        dialogConfig.callback(null);
        break;
    }
  };

  const onInputChange = (val: string) => {
    setInputValue(val);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      <DialogWrapper
        open={dialogOpen}
        dialogConfig={dialogConfig}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        onInputChange={onInputChange}
        inputValue={inputValue}
      />
      {children}
    </DialogContext.Provider>
  );
};
