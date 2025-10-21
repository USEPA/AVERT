import { type Action, combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { type ThunkAction } from "redux-thunk";
// ---
import { type RootState, type AppDispatch } from "@/redux/store";
import api from "@/redux/reducers/api";
import panel from "@/redux/reducers/panel";
import geography from "@/redux/reducers/geography";
import transportation from "@/redux/reducers/transportation";
import impacts from "@/redux/reducers/impacts";
import results from "@/redux/reducers/results";
import downloads from "@/redux/reducers/downloads";
import monthlyEmissions from "@/redux/reducers/monthlyEmissions";

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

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
