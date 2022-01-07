import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';

interface OptionsState {
  darkMode: boolean;
}

const initialState: OptionsState = {
  darkMode: false,
};

export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    changeOption: (state, action: PayloadAction<any>) => {},
  },
});

export default optionsSlice.reducer;
