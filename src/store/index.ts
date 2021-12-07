import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import alert from './alert';
import menu from './menu';
import bottomSheet from './bottomSheet';
import cart from './cart';
import dropdown from './dropdown';
import toast from './toast';
import user from './user';

export const store = configureStore({
  reducer: {
    alert,
    cart,
    menu,
    bottomSheet,
    dropdown,
    toast,
    user,
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
