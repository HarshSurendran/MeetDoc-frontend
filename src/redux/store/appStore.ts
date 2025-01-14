import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
import adminReducer from '../slices/adminSlice';
import doctorReducer from '../slices/doctorSlice';
import paymentReducer from "../slices/paymentSlice";

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

const doctorPersistConfig = {
  key: 'doctor',
  storage,
  blacklist: [],
};
const persistedDoctorReducer = persistReducer(
  doctorPersistConfig,
  doctorReducer
);

const appStore = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    doctor: persistedDoctorReducer,
    payment: paymentReducer
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
