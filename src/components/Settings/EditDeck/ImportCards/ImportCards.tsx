import { FC, FormEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  TextArea,
} from '@blueprintjs/core';
import { useDebouncedValue } from 'rooks';
import { nanoid } from 'nanoid';

import { FlashCard } from 'types';
import { parseCsv } from 'utils/csv';
import noop from 'utils/noop';

import ImportedDataPreview from './ImportedDataPreview';
import styles from './ImportCards.module.css';
import SeparatorOptions from '../SeparatorOptions/SeparatorOptions';

interface ImportCardsProps {
  show?: boolean;
  onClose?: () => void;
  onImport?: (cards: FlashCard[]) => void;
}

const ImportCards: FC<ImportCardsProps> = ({
  show,
  onImport = noop,
  onClose = noop,
}) => {
  const [csvData, setCsvData] = useState('');
  const [importedCards, setImportedCards] = useState<FlashCard[]>([]);
  const [csvDataDebounced, setCsvDataDebounced] = useDebouncedValue<string>(
    csvData,
    500
  );
  const [colSeparator, setColSeparator] = useState('\t');
  const [rowSeparator, setRowSeparator] = useState('\n');
  const [previewData, setPreviewData] = useState<FlashCard[]>([]);

  const handleCsvDataChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const val = (event.target as HTMLTextAreaElement).value;

    setCsvData(val);
  };

  const handleSeparatorChange = (
    colSeparator: string,
    rowSeparator: string
  ) => {
    setColSeparator(colSeparator);
    setRowSeparator(rowSeparator);
  };

  const handleUseItemsClick = () => {
    if (importedCards.length > 0) {
      onImport(importedCards);
      setCsvData('');
      setCsvDataDebounced('');
      onClose();
    }
  };

  useEffect(() => {
    const imported = parseCsv(csvDataDebounced as string, {
      rowSeparator,
      colSeparator,
    });
    const cardsToAdd = imported.map(({ frontSide, backSide }) => ({
      id: nanoid(),
      frontSide,
      backSide,
    }));

    setPreviewData(cardsToAdd.slice(0, 5));
    setImportedCards(cardsToAdd);
  }, [csvDataDebounced, colSeparator, rowSeparator]);

  return (
    <Dialog
      isOpen={show}
      title="Import cards"
      onClose={onClose}
      className={styles.dialog}
    >
      <div className={cn(Classes.DIALOG_BODY, styles.dialogBody)}>
        <FormGroup
          labelFor="import-data"
          label="Data to import"
          helperText="Copy and paste tabular data here from your favorite spreadsheet application (Excel, Google Spreadsheets, OpenOffice Calc, etc.)"
        >
          <TextArea
            className={styles.textarea}
            fill
            id="import-data"
            onChange={handleCsvDataChange}
            rows={10}
            value={csvData}
          />
        </FormGroup>
        <SeparatorOptions
          defaultColSeparator={colSeparator}
          defaultRowSeparator={rowSeparator}
          onChange={handleSeparatorChange}
        />
        <ImportedDataPreview data={previewData} />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button
          onClick={handleUseItemsClick}
          disabled={importedCards.length < 1}
        >
          Use items
        </Button>
      </div>
    </Dialog>
  );
};

export default ImportCards;
