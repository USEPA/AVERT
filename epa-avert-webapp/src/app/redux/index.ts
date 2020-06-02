import { Action, combineReducers } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import region from 'app/redux/reducers/region';
import panel from 'app/redux/reducers/panel';
import api from 'app/redux/reducers/api';
import rdfs from 'app/redux/reducers/rdfs';
import generation from 'app/redux/reducers/generation';
import so2 from 'app/redux/reducers/so2';
import nox from 'app/redux/reducers/nox';
import co2 from 'app/redux/reducers/co2';
import pm25 from 'app/redux/reducers/pm25';
import eere from 'app/redux/reducers/eere';
import annualDisplacement from 'app/redux/reducers/annualDisplacement';
import stateEmissions from 'app/redux/reducers/stateEmissions';
import monthlyEmissions from 'app/redux/reducers/monthlyEmissions';

const rootReducer = combineReducers({
  region,
  panel,
  api,
  rdfs,
  generation,
  so2,
  nox,
  co2,
  pm25,
  eere,
  annualDisplacement,
  stateEmissions,
  monthlyEmissions,
});

export default rootReducer;

type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
