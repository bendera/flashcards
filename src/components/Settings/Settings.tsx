import { FC } from 'react';
import { Classes } from '@blueprintjs/core';
import ImportCards from './ImportCards/ImportCards';

const Settings: FC = () => {
  return (
    <div className={Classes.DRAWER_BODY}>
      <div className={Classes.DIALOG_BODY}>
        <ImportCards />
      </div>
    </div>
  );
};

export default Settings;
