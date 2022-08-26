import { FC } from 'react';
import cn from 'classnames';
import { NonIdealState } from '@blueprintjs/core';
import { FlashCard } from 'types';
import styles from './ImportedDataPreview.module.css';

interface ImportedDataPreviewProps {
  data: FlashCard[];
}

const ImportedDataPreview: FC<ImportedDataPreviewProps> = ({ data }) => {
  const filtered = data.filter((_, i) => i < 5);
  const classes = cn([
    'bp4-html-table',
    'bp4-html-table-condensed',
    'bp4-html-table-striped',
    styles.table,
  ]);
  const empty = filtered.length < 1;

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
