// @flow

import React from 'react';
import { Provider } from 'react-redux';
// components
import App from 'app/components/App/container.js';
// types
import type { Store as ReduxStore } from 'redux';

type Props = {
  store: ReduxStore<>,
};

const Root = (props: Props) => (
  <Provider store={props.store}>
    <App />
  </Provider>
);

export default Root;
