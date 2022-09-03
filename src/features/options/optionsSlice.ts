import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import OptionsAPI, { OptionKey } from 'utils/OptionsAPI';

interface OptionsState {
  data: {
    darkMode: boolean;
    boxes: boolean;
    progress: boolean;
    firstRun: boolean;
  };
  loaded: boolean;
}

export const createInitialOptionsState = (): OptionsState => ({
  data: {
    boxes: false,
    darkMode: false,
    progress: false,
    firstRun: true,
  },
  loaded: false,
});

const initialState = createInitialOptionsState();

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
      state.data.boxes = action.payload;
    },
    toggleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.data.darkMode = action.payload;
    },
    toggleProgress: (state, action: PayloadAction<boolean>) => {
      state.data.progress = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAllOptions.pending, (state) => {
      state.loaded = false;
    });
    builder.addCase(fetchAllOptions.fulfilled, (state, action) => {
      state.loaded = true;
      state.data = action.payload;
    });
    builder.addCase(saveOption.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { toggleBoxes, toggleDarkMode, toggleProgress } =
  optionsSlice.actions;

export default optionsSlice.reducer;
