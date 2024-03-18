import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
// ---
import { App } from '@/app/components/App';
import { store } from '@/app/redux/store';
import '@/tailwind-preflight.css';
import '@/styles.css';

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
