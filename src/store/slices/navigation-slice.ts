import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/store';

const navigationSlice = createSlice({
  name: 'navigationslice',
  initialState: { showDrawerHeader: true },
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
  },
});

const navigationSelectors = {
  stateDrawerHeader: (state: RootState) =>
    state.navigationReducer.showDrawerHeader,
};

export const { stateDrawerHeader } = navigationSelectors;
export const { setDrawerHeader } = navigationSlice.actions;
export default navigationSlice.reducer;
