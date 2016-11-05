// Deps
import React, { Component } from 'react';
import { Provider } from 'react-redux';

// App
import App from './App';
import { store } from '../store';

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}
