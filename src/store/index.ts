import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
  AnyAction,
  CombinedState,
} from '@reduxjs/toolkit';
import alert from './alert';
import menu from './menu';
import bottomSheet from './bottomSheet';
import cart from './cart';
import dropdown from './dropdown';
import toast from './toast';
import user from './user';
import order from './order';
import common from './common';
import destination from './destination';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

// persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const combineReducer = combineReducers({
  alert,
  cart,
  menu,
  bottomSheet,
  dropdown,
  toast,
  user,
  common,
  destination,
  order,
});

const rootReducer = (state: any, action: AnyAction): CombinedState<any> => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.alert) nextState.alert = state.alert;
    if (state.cart) nextState.cart = state.cart;
    if (state.menu) nextState.menu = state.menu;
    if (state.bottomSheet) nextState.bottomSheet = state.bottomSheet;
    if (state.dropdown) nextState.dropdown = state.dropdown;
    if (state.toast) nextState.toast = state.toast;
    if (state.user) nextState.user = state.user;
    if (state.common) nextState.common = state.common;
    if (state.destination) nextState.destination = state.destination;
    if (state.order) nextState.order = state.order;

    return nextState;
  }
  return combineReducer(state, action);
};

const isDev = process.env.NODE_ENV !== 'production';

const makeConfigureStore = (reducer: any) =>
  configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(),
    devTools: isDev,
  });

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

const makeStore = (context: any) => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // server
    return makeConfigureStore(rootReducer);
  } else {
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    // client
    const persistConfig = {
      key: 'nextjs',
      storage,
      whitelist: ['order', 'destination', 'cart', 'user', 'menu'],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store: any = makeConfigureStore(persistedReducer);

    store.__persistor = persistStore(store);

    return store;
  }
};

export const wrapper = createWrapper(makeStore, {
  debug: false,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
