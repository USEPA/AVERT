import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import reduxMulti from 'redux-multi';
// reducers
import reducers from '../reducers';

const logger = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (preloadedState) => {
  const store = createStore(
    reducers,
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        logger,
        thunkMiddleware,
        reduxMulti,
      )
    )
  );

  return store;
};

export default configureStore;
