import {
  configureStore,
  getDefaultMiddleware,
  EnhancedStore,
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
import { createWrapper, MakeStore, HYDRATE, Context } from 'next-redux-wrapper';

// persist
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = (state: any, action: AnyAction): CombinedState<any> => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }
  return combineReducers({
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
  })(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

/* TODO: MakeStore generic 모르겠음.. */
// const setupStore = (context: Context): EnhancedStore => store;
// const makeStore: MakeStore<any> = (context: any) => setupStore(context);

// export const wrapper = createWrapper<any>(makeStore, {
//   debug: process.env.NODE_ENV !== 'production',
// });

const isDev = process.env.NODE_ENV !== 'production';

const makeStore = (context: any) => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // server
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(),
      devTools: isDev,
    });
  } else {
    // client
    const persistConfig = {
      key: 'nextjs',
      storage,
      blacklist: ["toast"],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(),
      devTools: isDev,
    });

    return store
  }
}


export const wrapper = createWrapper(makeStore, {
  debug: isDev,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default wrapper;
