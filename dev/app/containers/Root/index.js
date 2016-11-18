import React from 'react';
import { Provider } from 'react-redux';
// store
import store from '../../store';
// container
import AppContainer from '../AppContainer';

const Root = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

export default Root;
