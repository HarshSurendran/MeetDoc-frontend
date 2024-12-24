import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";

const appStore = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;

export default appStore;
