import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import navigationReducer from '@store/slices/navigation-slice';
import userReducer from '@store/slices/user-slice';

const store = configureStore({
  reducer: {
    navigationReducer: navigationReducer,
    userReducer: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
