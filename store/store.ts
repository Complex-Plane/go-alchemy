import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  MigrationManifest
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dateReducer from './dateSlice';
import settingsReducer from './settingsSlice';
import userReducer from './userSlice';

import benchmarkMiddleware from '../middleware/benchmarkMiddleware';

/**
 * Redux Store Configuration
 *
 * This file sets up the Redux store with:
 * - Redux Toolkit for simplified Redux usage
 * - Redux Persist for state persistence across app launches
 * - AsyncStorage as the persistence backend
 * - Custom middleware for performance monitoring
 *
 * The store manages three main state slices:
 * - date: Tracks daily problem completion
 * - settings: User preferences and app configuration
 * - user: User progress and statistics
 */

/**
 * Migration configuration for Redux Persist
 * Handles state structure changes between app versions
 */
const migrations: MigrationManifest = {
  0: (state) => {
    // migration clear out device state
    return {
      ...state,
      device: undefined
    };
  },
  1: (state) => {
    // migration to keep only device state
    return {
      device: state?.device
    };
  }
};

const persistConfig = {
  key: 'root',
  verions: 1,
  storage: AsyncStorage,
  migrate: createMigrate(migrations, { debug: __DEV__ })
};

const rootReducer = combineReducers({
  date: dateReducer,
  settings: settingsReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(benchmarkMiddleware)
});

export const persistor = persistStore(store);

/**
 * Utility function to clear all persisted storage
 * Useful for debugging and resetting app state
 *
 * @async
 * @returns {Promise<void>}
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    persistor.purge();
    console.warn('Storage cleared!');
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
};

/**
 * TypeScript types for Redux usage
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
