import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/features/array/includes';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
// components
import App from 'app/components/App';
// store
import store from 'app/redux/store';

const container = document.getElementById('root') as HTMLElement;

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
