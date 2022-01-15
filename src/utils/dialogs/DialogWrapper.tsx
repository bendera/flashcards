import { FC, FormEvent } from 'react';
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { DialogConfig, DialogType } from './DialogProvider';

const getDefaultTitle = (dialogType: DialogType) => {
  switch (dialogType) {
    case 'alert':
      return 'Alert';
    case 'confirm':
      return 'Confirmation';
    case 'prompt':
      return 'Prompt';
  }
};

const PROMPT_ID = '__prompt-dialog_input__';

interface DialogWrapperProps {
  open: boolean;
  dialogConfig: DialogConfig;
  onConfirm: () => void;
  onDismiss: () => void;
  onInputChange: (val: string) => void;
  inputValue: string;
}

const DialogWrapper: FC<DialogWrapperProps> = ({
  open,
  dialogConfig,
  onConfirm,
  onDismiss,
  onInputChange,
  inputValue,
}) => {
  const { dialogType, message, options } = dialogConfig;
  const {
    title = getDefaultTitle(dialogType),
    okButtonLabel = 'OK',
    cancelButtonLabel = 'Cancel',
  } = options;

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;

    onInputChange(input.value);
  };

  return (
    <Dialog
      isOpen={open}
      title={title}
      onClose={() => {
        onDismiss();
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        {dialogConfig.dialogType === 'prompt' ? (
          <FormGroup label={message} labelFor={PROMPT_ID}>
            <InputGroup
              id={PROMPT_ID}
              onChange={handleInputChange}
              value={inputValue}
            />
          </FormGroup>
        ) : (
          message
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            onClick={() => {
              onConfirm();
            }}
          >
            {okButtonLabel}
          </Button>
          {dialogType !== 'alert' ? (
            <Button
              onClick={() => {
                onDismiss();
              }}
            >
              {cancelButtonLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
};

export default DialogWrapper;
