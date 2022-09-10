import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '@src/store';

const navigationSlice = createSlice({
  name: 'navigationslice',
  initialState: { showDrawerHeader: true, title: '' },
  reducers: {
    setDrawerHeader: {
      reducer: (state, action: PayloadAction<boolean>) => {
        state.showDrawerHeader = action.payload;
      },
      prepare: (value: boolean) => {
        return {
          payload: value,
        };
      },
    },
    setTitle: {
      reducer: (state, action: PayloadAction<string>) => {
        state.title = action.payload;
      },
      prepare: (value: string) => {
        return {
          payload: value,
        };
      },
    },
  },
});

const navigationSelectors = {
  stateDrawerHeader: (state: RootState) =>
    state.navigationReducer.showDrawerHeader,

  stateTitle: (state: RootState) => state.navigationReducer.title,
};

export const { stateDrawerHeader, stateTitle } = navigationSelectors;
export const { setDrawerHeader, setTitle } = navigationSlice.actions;
export default navigationSlice.reducer;
