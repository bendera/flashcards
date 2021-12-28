import { FC } from 'react';
import { Classes, Tab, Tabs } from '@blueprintjs/core';
import EditCards from './EditCards/EditCards';
import EditDecks from './EditDecks/EditDecks';

const Settings: FC = () => {
  return (
    <div className={Classes.DRAWER_BODY}>
      <div className={Classes.DIALOG_BODY}>
        <Tabs
          id="settingsTab"
          renderActiveTabPanelOnly
        >
          <Tab id="import" title="Edit decks" panel={<EditDecks />} />
          <Tab id="edit" title="Edit" panel={<EditCards />} />
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
