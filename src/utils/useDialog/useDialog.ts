import { useContext } from 'react';
import { DialogContext } from './DialogProvider';

export interface DialogOptions {
  title?: string;
}

export const useDialog = () => {
  const { openDialog } = useContext(DialogContext);

  const confirm = (message: string, options: DialogOptions = {}) =>
    new Promise((resolve) => {
      openDialog({ message, options, callback: resolve });
    });

  return {
    confirm,
  };
};
