import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { RootState } from '@src/store';
import { Inventory } from '@interfaces/inventory.dto';

const userSlice = createSlice({
  name: 'userslice',
  initialState: {
    inventoryRef: {} as FirebaseFirestoreTypes.DocumentReference<Inventory>,
  },
  reducers: {
    setInventoryRef: {
      reducer: (
        state,
        action: PayloadAction<
          FirebaseFirestoreTypes.DocumentReference<Inventory>
        >,
      ) => {
        state.inventoryRef = action.payload;
      },
      prepare: (value: FirebaseFirestoreTypes.DocumentReference<Inventory>) => {
        return {
          payload: value,
        };
      },
    },
  },
});

const userSelectors = {
  stateUser: (state: RootState) => state.userReducer.inventoryRef,
};

export const { stateUser } = userSelectors;
export const { setInventoryRef } = userSlice.actions;
export default userSlice.reducer;
