import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import alert from './alert';
import menu from './menu';
import bottomSheet from './bottomSheet';

export const store = configureStore({
  reducer: {
    alert,
    menu,
    bottomSheet,
  },
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
