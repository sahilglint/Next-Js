import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import layoutReducer from './layoutSlice';
import autosaveMiddleware from './autosaveMiddleware';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import type { Middleware } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'layout',
  version: 1,
  storage,
};

const undoableLayout = undoable(layoutReducer);
const persistedReducer = persistReducer(persistConfig, undoableLayout);

const store = configureStore({
  reducer: {
    layout: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(autosaveMiddleware as Middleware),
});

const persistor = persistStore(store);

export { store, persistor };

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
