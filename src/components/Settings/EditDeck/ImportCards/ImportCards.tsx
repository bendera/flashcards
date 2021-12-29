import { FC, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Collapse,
  FormGroup,
  Radio,
  RadioGroup,
  TextArea,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDebounce } from 'rooks';
import { nanoid } from 'nanoid';

import { FlashCard } from 'types';
import { parseCsv } from 'utils/csv';
import noop from 'utils/noop';

import ImportedDataPreview from './ImportedDataPreview';
import styles from './ImportCards.module.css';

interface ImportCardsProps {
  onImport?: (cards: FlashCard[]) => void;
}

const ImportCards: FC<ImportCardsProps> = ({ onImport: onSave = noop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [csvDataDelayed, setCsvDataDelayed] = useState('');
  const [importedCards, setImportedCards] = useState<FlashCard[]>([]);
  const setCsvDataDebounced = useDebounce(setCsvDataDelayed, 500);
  const [columnSeparator, setColumnSeparator] = useState('\t');
  const [rowSeparator, setRowSeparator] = useState('\n');
  const [previewData, setPreviewData] = useState<FlashCard[]>([]);

  const handleCsvDataChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const val = (event.target as HTMLTextAreaElement).value;

    setCsvData(val);
    setCsvDataDebounced(val);
  };

  const handleColumnSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    setColumnSeparator((event.target as HTMLInputElement).value);
  };

  const handleRowSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    setRowSeparator((event.target as HTMLInputElement).value);
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleUseItemsClick = () => {
    if (importedCards.length > 0) {
      onSave(importedCards);
      setCsvData('');
      setCsvDataDelayed('');
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const imported = parseCsv(csvDataDelayed);
    const cardsToAdd = imported.map(({ frontSide, backSide }) => ({
      id: nanoid(),
      frontSide,
      backSide,
    }));

    setPreviewData(cardsToAdd.slice(0, 5));
    setImportedCards(cardsToAdd);
  }, [csvDataDelayed]);

  return (
    <Card>
      <Button
        icon={isOpen ? IconNames.DELETE : IconNames.IMPORT}
        onClick={handleToggleClick}
      >
        {isOpen ? 'Cancel import' : 'Import'}
      </Button>
      <Collapse isOpen={isOpen}>
        <div className={styles.form}>
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
          <div className={styles.separatorOptions}>
            <RadioGroup
              className={styles.radioGroup}
              inline
              label="Column separator"
              name="column-separator"
              onChange={handleColumnSeparatorChange}
              selectedValue={columnSeparator}
            >
              <Radio label="Tab" value={'\t'} />
              <Radio label="Comma" value="," />
            </RadioGroup>
            <RadioGroup
              className={styles.radioGroup}
              inline
              label="Row separator"
              name="row-separator"
              onChange={handleRowSeparatorChange}
              selectedValue={rowSeparator}
            >
              <Radio label="Newline" value={'\n'} />
              <Radio label="Semicolon" value=";" />
            </RadioGroup>
          </div>
          <ImportedDataPreview data={previewData} />
          <Button
            onClick={handleUseItemsClick}
            disabled={importedCards.length < 1}
          >
            Use items
          </Button>
        </div>
      </Collapse>
    </Card>
  );
};

export default ImportCards;
