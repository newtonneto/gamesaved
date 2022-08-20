import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User } from '@interfaces/user.dto';
import { RootState } from '@src/store';

const userSlice = createSlice({
  name: 'userslice',
  initialState: { user: {} as User },
  reducers: {
    setUser: {
      reducer: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
      prepare: (value: User) => {
        return {
          payload: value,
        };
      },
    },
  },
});

const userSelectors = {
  stateUser: (state: RootState) => state.userReducer.user,
};

export const { stateUser } = userSelectors;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
