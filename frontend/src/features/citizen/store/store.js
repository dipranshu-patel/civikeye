import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../../../shared/store/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});
