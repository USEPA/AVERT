import { createStore, applyMiddleware, compose } from 'redux';
// import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
// reducers
// import reducers from '../reducers';
import reducer from '../redux/modules/reducer';

const composeEnhancers = (typeof window !== 'undefined') ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

const middleware = applyMiddleware(
  // createLogger(),
  thunkMiddleware,
);

const configureStore = (preloadedState) => {

  return createStore(
    reducer,
    preloadedState,
    composeEnhancers(middleware),
  );
};

export default configureStore;
