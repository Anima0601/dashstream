import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import userPreferencesReducer from './slices/userPreferencesSlice';
import favoritesReducer from './slices/favoritesSlice';
import { newsApi } from './services/newsApi';
import { tmdbApi } from './services/tmdbApi';
import { socialApi } from './services/socialApi';

const rootReducer = combineReducers({
  userPreferences: userPreferencesReducer,
  favorites: favoritesReducer,
  [newsApi.reducerPath]: newsApi.reducer,
  [tmdbApi.reducerPath]: tmdbApi.reducer,
  [socialApi.reducerPath]: socialApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userPreferences', 'favorites'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'newsApi/executeQuery/pending',
          'newsApi/executeQuery/fulfilled',
          'newsApi/executeQuery/rejected',
          'tmdbApi/executeQuery/pending',
          'tmdbApi/executeQuery/fulfilled',
          'tmdbApi/executeQuery/rejected',
          'socialApi/executeQuery/pending',
          'socialApi/executeQuery/fulfilled',
          'socialApi/executeQuery/rejected',
        ],
      },
    }).concat(
      newsApi.middleware,
      tmdbApi.middleware,
      socialApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
