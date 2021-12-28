import { FC } from 'react';
import { Classes, Tab, Tabs } from '@blueprintjs/core';
import ImportCards from './ImportCards/ImportCards';
import EditCards from './EditCards/EditCards';

const Settings: FC = () => {
  return (
    <div className={Classes.DRAWER_BODY}>
      <div className={Classes.DIALOG_BODY}>
        <Tabs
          id="settingsTab"
          renderActiveTabPanelOnly
        >
          <Tab id="import" title="Edit decks" panel={<ImportCards />} />
          <Tab id="edit" title="Edit" panel={<EditCards />} />
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
