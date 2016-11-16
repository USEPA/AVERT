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





// // action creators
// import { setActiveStep } from '../../actions';
//
// console.log('--------------');
// console.log('Initial State:');
// console.log(store.getState());
//
// console.log('Dispatch setActiveStep');
// store.dispatch(setActiveStep(2));
// console.log('Updated State:');
// console.log(store.getState());
//
// console.log('Dispatch setActiveStep');
// store.dispatch(setActiveStep(3));
// console.log('Updated State:');
// console.log(store.getState());
