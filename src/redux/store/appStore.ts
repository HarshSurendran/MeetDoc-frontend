import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import persistStore from "redux-persist/es/persistStore";
import adminReducer from "../slices/adminSlice";

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: [],
};
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const adminPersistConfig = {
  key: 'admin',
  storage,
  blacklist: [],
};
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

const appStore = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], 
      },
    }),
});


export const persistor = persistStore(appStore);
export type RootState = ReturnType<typeof appStore.getState>;
export default appStore;
