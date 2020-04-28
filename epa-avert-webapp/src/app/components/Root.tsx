import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
// components
import App from 'app/components/App/App';

type Props = {
  store: Store;
};

function Root({ store }: Props) {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default Root;
