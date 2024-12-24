import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import persistStore from "redux-persist/es/persistStore";

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['loading', 'error', 'modal'],
};
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const appStore = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});


export const persistor = persistStore(appStore);
export type RootState = ReturnType<typeof appStore.getState>;
export default appStore;
