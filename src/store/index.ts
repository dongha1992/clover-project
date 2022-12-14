import { configureStore, getDefaultMiddleware, combineReducers, AnyAction, CombinedState } from '@reduxjs/toolkit';
import loading from './loading';
import alert from './alert';
import menu from './menu';
import bottomSheet from './bottomSheet';
import cart from './cart';
import dropdown from './dropdown';
import toast from './toast';
import user from './user';
import order from './order';
import common from './common';
import spot from './spot';
import destination from './destination';
import coupon from './coupon';
import mypage from './mypage';
import subscription from './subscription';
import filter from './filter';
import review from './review';
import event from './event';
import imageViewer from './imageViewer';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const rootReducer = (state: any, action: AnyAction): CombinedState<any> => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return combineReducers({
    loading,
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
    spot,
    coupon,
    mypage,
    subscription,
    filter,
    review,
    event,
    imageViewer
  })(state, action);
};

const isDev = process.env.NODE_ENV !== 'production';

const makeConfigureStore = (reducer: any) =>
  configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(),
    devTools: isDev,
  });

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  devTools: isDev,
});

const makeStore = () => {
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
      whitelist: [
        'order',
        'destination',
        'cart',
        'menu',
        'common',
        'coupon',
        'spot',
        'subscription',
        'mypage',
        'user',
        'review',
        'event',
      ],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store: any = makeConfigureStore(persistedReducer);

    store.__persistor = persistStore(store);

    return store;
  }
};

export const wrapper = createWrapper(makeStore, {
  debug: isDev,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
