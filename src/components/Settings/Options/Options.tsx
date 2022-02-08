import { Switch } from '@blueprintjs/core';
import { FC } from 'react';

const Options: FC = () => {
  return (
    <div>
      <Switch label="Dark theme" large />
      <Switch label="Show progress" large />
      <Switch label="Show boxes" large />
    </div>
  );
};

export default Options;
