import { combineReducers } from "@reduxjs/toolkit";
import { reducer as reduxFormReducer } from "redux-form";
import authReducer from "./auth";
import storeReducer from "./stores";
import profileReducer from "./profile";
import globalReducer from "./global";
import tradeReducer from "./trade";
import { firebaseReducer } from "react-redux-firebase";

export const rootReducer = combineReducers({
  form: reduxFormReducer,
  auth: authReducer,
  store: storeReducer,
  profile: profileReducer,
  global: globalReducer,
  trade: tradeReducer,
  firebase: firebaseReducer,
});
