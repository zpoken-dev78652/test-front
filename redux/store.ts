import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { rootReducer } from ".";
import { reducer as reduxFormReducer } from "redux-form";
import storeReducer from "./stores";
import authReducer from "./auth";
import globalReducer from "./global";
import profileReducer from "./profile";
import tradeReducer from "./trade";
import { firebaseReducer } from "react-redux-firebase";

export const store = configureStore({
  reducer: {
    form: reduxFormReducer,
    store: storeReducer,
    auth: authReducer,
    profile: profileReducer,
    global: globalReducer,
    trade: tradeReducer,
    firebase: firebaseReducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export type RootState = ReturnType<typeof rootReducer>;
