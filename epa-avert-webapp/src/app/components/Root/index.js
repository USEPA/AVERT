import React from 'react';
import { Provider } from 'react-redux';
// containers
import AppContainer from '../../containers/AppContainer';

const Root = (props) => (
  <Provider store={props.store}>
    <AppContainer />
  </Provider>
);

export default Root;
