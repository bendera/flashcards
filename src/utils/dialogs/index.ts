import { useContext } from 'react';
import { DialogContext } from './DialogProvider';

export interface ModalOptions {
  title?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
}

const defaultOptions: ModalOptions = {
  title: `${document.location.host} says:`,
  okButtonLabel: 'OK',
  cancelButtonLabel: 'Cancel',
};

export const useConfirm = (
  defaultHookOptions: ModalOptions = {
    ...defaultOptions,
    title: 'Confirmation',
  }
) => {
  const { openDialog } = useContext(DialogContext);

  const confirm = (message: string, options: ModalOptions = {}) =>
    new Promise<boolean>((resolve) => {
      openDialog({
        message,
        options: { ...defaultHookOptions, ...options },
        dialogType: 'confirm',
        callback: resolve,
      });
    });

  return confirm;
};

export const useAlert = (
  defaultHookOptions: ModalOptions = {
    ...defaultOptions,
    title: 'Alert',
  }
) => {
  const { openDialog } = useContext(DialogContext);

  const alert = (message: string, options: ModalOptions = {}) =>
    new Promise<void>((resolve) => {
      openDialog({
        message,
        options: { ...defaultHookOptions, ...options },
        dialogType: 'alert',
        callback: resolve,
      });
    });

  return alert;
};

export const usePrompt = (
  defaultHookValue: string = '',
  defaultHookOptions: ModalOptions = {
    ...defaultOptions,
    title: 'Prompt',
  }
) => {
  const { openDialog } = useContext(DialogContext);

  const prompt = (
    message: string,
    defaultValue: string = defaultHookValue,
    options: ModalOptions = {}
  ) =>
    new Promise<string | null>((resolve) => {
      openDialog({
        message,
        defaultValue,
        options: { ...defaultHookOptions, ...options },
        dialogType: 'prompt',
        callback: resolve,
      });
    });

  return prompt;
};
