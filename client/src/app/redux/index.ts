import { type Action, combineReducers } from 'redux';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { type ThunkAction } from 'redux-thunk';
// ---
import { type RootState, type AppDispatch } from '@/app/redux/store';
import api from '@/app/redux/reducers/api';
import panel from '@/app/redux/reducers/panel';
import geography from '@/app/redux/reducers/geography';
import transportation from '@/app/redux/reducers/transportation';
import impacts from '@/app/redux/reducers/impacts';
import results from '@/app/redux/reducers/results';
import downloads from '@/app/redux/reducers/downloads';
import monthlyEmissions from '@/app/redux/reducers/monthlyEmissions';

export const rootReducer = combineReducers({
  api,
  panel,
  geography,
  transportation,
  impacts,
  results,
  downloads,
  monthlyEmissions,
});

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
