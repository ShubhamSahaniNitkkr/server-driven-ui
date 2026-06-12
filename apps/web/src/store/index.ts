import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import permissionsReducer from './slices/permissionsSlice';
import featureFlagsReducer from './slices/featureFlagsSlice';
import uiReducer from './slices/uiSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    permissions: permissionsReducer,
    featureFlags: featureFlagsReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
