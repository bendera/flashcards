import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import OptionsAPI, { OptionKey } from 'utils/OptionsAPI';

interface OptionsState {
  darkMode: boolean;
  boxes: boolean;
  progress: boolean;
}

const initialState: OptionsState = {
  boxes: false,
  darkMode: false,
  progress: false,
};

export const fetchAllOptions = createAsyncThunk('options/get', async () => {
  const optionsAPI = new OptionsAPI();
  const data = await optionsAPI.getAllOptions();

  return data;
});

export const saveOption = createAsyncThunk(
  'options/save',
  async ({ key, value }: { key: OptionKey; value: any }) => {
    const optionsAPI = new OptionsAPI();
    const data = await optionsAPI.setOption(key, value);

    return data;
  }
);

export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    toggleBoxes: (state, action: PayloadAction<boolean>) => {
      state.boxes = action.payload;
    },
    toggleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleProgress: (state, action: PayloadAction<boolean>) => {
      state.progress = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAllOptions.fulfilled, (_state, action) => {
      return { ...action.payload };
    });
    builder.addCase(saveOption.fulfilled, (_state, action) => {
      return { ...action.payload };
    });
  },
});

export const { toggleBoxes, toggleDarkMode, toggleProgress } =
  optionsSlice.actions;

export default optionsSlice.reducer;
