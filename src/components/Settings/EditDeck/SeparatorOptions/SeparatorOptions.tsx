import { Radio, RadioGroup } from '@blueprintjs/core';
import { FC, FormEvent, useState } from 'react';
import noop from 'utils/noop';
import styles from './SeparatorOptions.module.css';

interface SeparatorOptionsProps {
  defaultColSeparator?: string;
  defaultRowSeparator?: string;
  onChange?: (colSeparator: string, rowSeparator: string) => void;
}

const SeparatorOptions: FC<SeparatorOptionsProps> = ({
  defaultColSeparator = '\t',
  defaultRowSeparator = '\n',
  onChange = noop,
}) => {
  const [colSeparator, setColSeparator] = useState(defaultColSeparator);
  const [rowSeparator, setRowSeparator] = useState(defaultRowSeparator);

  const handleColumnSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    const newVal = (event.target as HTMLInputElement).value;

    setColSeparator(newVal);
    onChange(newVal, rowSeparator);
  };

  const handleRowSeparatorChange = (event: FormEvent<HTMLInputElement>) => {
    const newVal = (event.target as HTMLInputElement).value;

    setRowSeparator(newVal);
    onChange(colSeparator, newVal);
  };

  return (
    <div className={styles.root}>
      <RadioGroup
        className={styles.radioGroup}
        inline
        label="Column separator"
        name="column-separator"
        onChange={handleColumnSeparatorChange}
        selectedValue={colSeparator}
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
  );
};

export default SeparatorOptions;
