import { FC, FormEvent, useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  TextArea,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useDebounce } from 'rooks';
import { parseCsv } from 'utils/csv';
import { CardDO } from 'features/deck/deckSlice';
import styles from './ImportCards.module.css';
import ImportedDataPreview from './ImportedDataPreview';

interface ImportCardsProps {
  onSave?: () => void;
}

const ImportCards: FC<ImportCardsProps> = ({ onSave }) => {
  const [csvData, setCsvData] = useState('');
  const setCsvDataDebounced = useDebounce(setCsvData, 500);
  const [columnSeparator, setColumnSeparator] = useState('\t');
  const [rowSeparator, setRowSeparator] = useState('\n');
  const [importedData, setImportedData] = useState<CardDO[]>([]);

  const handleCsvDataChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const val = (event.target as HTMLTextAreaElement).value;
    setCsvDataDebounced(val);
  };

  const handleColumnSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    console.log(event);
    setColumnSeparator((event.target as HTMLInputElement).value);
  };

  const handleRowSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    setRowSeparator((event.target as HTMLInputElement).value);
  };

  const handleSaveClick = () => {

  };

  useEffect(() => {
    console.log(csvData);
    setImportedData(parseCsv(csvData));
  }, [csvData]);

  return (
    <div>
      <h2 className="bp3-heading">Import cards</h2>
      <FormGroup labelFor="import-data" label="Imported data">
        <TextArea
          className={styles.textarea}
          fill
          id="import-data"
          onChange={handleCsvDataChange}
          rows={10}
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
      <ImportedDataPreview data={importedData} />
      <Button icon={IconNames.FLOPPY_DISK} onClick={handleSaveClick}>
        Save &amp; Edit
      </Button>
      <Checkbox label="Overwrite existing items" />
    </div>
  );
};

export default ImportCards;
