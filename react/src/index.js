import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// import { selectRegion, fetchRegion } from './app/actions';
import avertApp from './app/reducers';
import App from './app/components/App';
import './index.css';

const loggerMiddleware = createLogger();
let store = createStore(
	avertApp, 
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
));

// store.dispatch(selectRegion('javascript'));
// store.dispatch(fetchRegion('javascript')).then(() =>
// 	console.log(store.getState())
// )

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
