import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import createLogger from 'redux-logger';
import reduxMulti from 'redux-multi';
import avertApp from '../reducers';

// const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
    return createStore(
        avertApp,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            // loggerMiddleware,
            reduxMulti,
        )
    )
};