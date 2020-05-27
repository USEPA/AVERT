import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// reducers
import reducer from 'app/redux/index';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// use Chrome Redux devtools extension if its installed
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...[thunk]));

const store = createStore(reducer, {}, enhancer);

export default store;
