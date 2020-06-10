import { Action, combineReducers } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import api from 'app/redux/reducers/api';
import panel from 'app/redux/reducers/panel';
import region from 'app/redux/reducers/region';
import eere from 'app/redux/reducers/eere';
import generation from 'app/redux/reducers/displacementGeneration';
import so2 from 'app/redux/reducers/displacementSo2';
import nox from 'app/redux/reducers/displacementNox';
import co2 from 'app/redux/reducers/displacementCo2';
import pm25 from 'app/redux/reducers/displacementPm25';
import annualDisplacement from 'app/redux/reducers/annualDisplacement';
import stateEmissions from 'app/redux/reducers/stateEmissions';
import monthlyEmissions from 'app/redux/reducers/monthlyEmissions';

const rootReducer = combineReducers({
  api,
  panel,
  region,
  eere,
  generation,
  so2,
  nox,
  co2,
  pm25,
  annualDisplacement,
  stateEmissions,
  monthlyEmissions,
});

export default rootReducer;

type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
