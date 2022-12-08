import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import {
  AnchorButton,
  Classes,
  Dialog,
  FormGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import styles from './ExportCards.module.css';
import { CardListItemData } from '../CardItemList/CardItemList';
import SeparatorOptions from '../SeparatorOptions/SeparatorOptions';
import { generateCsv } from 'utils/csv';

interface ExportCardsProps {
  cards: CardListItemData[];
  deckTitle: string;
  show?: boolean;
  onClose?: () => void;
}

const ExportCards: FC<ExportCardsProps> = ({
  cards,
  deckTitle,
  show,
  onClose,
}) => {
  const [colSeparator, setColSeparator] = useState('\t');
  const [rowSeparator, setRowSeparator] = useState('\n');
  const [csvData, setCsvData] = useState('');

  const filename = deckTitle.toLocaleLowerCase().replaceAll(/ /gm, '_');

  useEffect(() => {
    setCsvData(
      generateCsv(cards, {
        colSeparator,
        rowSeparator,
      })
    );
  }, [cards, colSeparator, rowSeparator]);

  const handleSeparatorChange = (
    colSeparator: string,
    rowSeparator: string
  ) => {
    setColSeparator(colSeparator);
    setRowSeparator(rowSeparator);
  };

  return (
    <Dialog
      isOpen={show}
      title="Export cards"
      onClose={onClose}
      className={styles.dialog}
    >
      <div className={cn(Classes.DIALOG_BODY, styles.dialogBody)}>
        <FormGroup labelFor="export-data" label="Data to export">
          <TextArea
            className={styles.textarea}
            fill
            id="export-data"
            rows={10}
            value={csvData}
          />
        </FormGroup>
        <SeparatorOptions
          defaultColSeparator={colSeparator}
          defaultRowSeparator={rowSeparator}
          onChange={handleSeparatorChange}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <AnchorButton
            href={`data:text/csv;charset=UTF-8,${encodeURIComponent(csvData)}`}
            download={filename}
            intent={Intent.PRIMARY}
          >
            download
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  );
};

export default ExportCards;
