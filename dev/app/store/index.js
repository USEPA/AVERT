import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
// reducers
import reducers from '../reducers';

const logger = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(logger)
  )
);

export default store;
