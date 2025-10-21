import { legacy_createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
// ---
import { rootReducer } from "@/redux/index";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// use Chrome Redux devtools extension if its installed
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...[thunk]));

export const store = legacy_createStore(rootReducer, {}, enhancer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
