import React from 'react';
import { render } from 'react-dom';

// components
import Root from './app/components/Root';
// store
import store from './app/store';

render(<Root store={store} />, document.getElementById('root'));
