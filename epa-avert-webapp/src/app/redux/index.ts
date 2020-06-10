import { Action, combineReducers } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import api from './reducers/api';
import panel from './reducers/panel';
import region from './reducers/region';
import eere from './reducers/eere';
import displacement from './reducers/displacement';
import stateEmissions from './reducers/stateEmissions';
import monthlyEmissions from './reducers/monthlyEmissions';

const rootReducer = combineReducers({
  api,
  panel,
  region,
  eere,
  displacement,
  stateEmissions,
  monthlyEmissions,
});

export default rootReducer;

type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
