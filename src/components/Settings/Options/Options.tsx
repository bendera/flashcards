import { ChangeEvent, FC } from 'react';
import { Switch } from '@blueprintjs/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { saveOption } from 'features/options/optionsSlice';
import { OptionKey } from 'utils/OptionsAPI';
import SettingsPage from '../SettingsPage';

const Options: FC = () => {
  const dispatch = useAppDispatch();
  const { boxes, darkMode, progress } = useAppSelector(
    (state) => state.options.data
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    dispatch(saveOption({ key: name as OptionKey, value: checked }));
  };

  return (
    <SettingsPage>
      <Switch
        label="Dark theme"
        onChange={handleChange}
        name="darkMode"
        checked={darkMode}
        large
      />
      <Switch
        label="Show progress"
        onChange={handleChange}
        name="progress"
        checked={progress}
        large
      />
      <Switch
        label="Show boxes"
        onChange={handleChange}
        name="boxes"
        checked={boxes}
        large
      />
    </SettingsPage>
  );
};

export default Options;
