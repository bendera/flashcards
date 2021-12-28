import { FC } from 'react';
import cn from 'classnames';
import { CardDO } from 'features/deck/deckSlice';
import styles from './ImportedDataPreview.module.css';
import { NonIdealState } from '@blueprintjs/core';

interface ImportedDataPreviewProps {
  data: CardDO[];
}

const ImportedDataPreview: FC<ImportedDataPreviewProps> = ({ data }) => {
  const filtered = data.filter((_, i) => i < 5);
  const classes = cn([
    'bp3-html-table',
    'bp3-html-table-condensed',
    'bp3-html-table-striped',
    styles.table,
  ]);
  const empty = filtered.length < 1;

  console.log(filtered);

  return (
    <div className={styles.wrapper}>
      {!empty ? (
        <div className={styles.tableWrapper}>
          <table className={classes}>
            <caption>Preview</caption>
            <thead>
              <tr>
                <th>Term</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ frontSide, backSide }) => (
                <tr key={frontSide}>
                  <td>{frontSide}</td>
                  <td>{backSide}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NonIdealState title="No data to preview" />
      )}
    </div>
  );
};

export default ImportedDataPreview;
