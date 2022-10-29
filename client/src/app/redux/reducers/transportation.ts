// reducers
import { AppThunk } from 'app/redux/index';
import { RegionalLoadData } from 'app/redux/reducers/geography';
// calculations
import type { DailyStats, MonthlyStats } from 'app/calculations/transportation';
import {
  createDailyStats,
  createMonthlyStats,
} from 'app/calculations/transportation';

type TransportationAction =
  | {
      type: 'transportation/SET_DAILY_STATS';
      payload: { dailyStats: DailyStats };
    }
  | {
      type: 'transportation/SET_MONTHLY_STATS';
      payload: { monthlyStats: MonthlyStats };
    };

type TransportationState = {
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
};

// reducer
const initialState: TransportationState = {
  dailyStats: {},
  monthlyStats: {},
};

export default function reducer(
  state: TransportationState = initialState,
  action: TransportationAction,
): TransportationState {
  switch (action.type) {
    case 'transportation/SET_DAILY_STATS': {
      const { dailyStats } = action.payload;

      return {
        ...state,
        dailyStats,
      };
    }

    case 'transportation/SET_MONTHLY_STATS': {
      const { monthlyStats } = action.payload;

      return {
        ...state,
        monthlyStats,
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
export function storeTransportationData(
  regionalLoad: RegionalLoadData[],
): AppThunk {
  const dailyStats = createDailyStats(regionalLoad);
  const monthlyStats = createMonthlyStats(dailyStats);

  return (dispatch) => {
    dispatch({
      type: 'transportation/SET_DAILY_STATS',
      payload: { dailyStats },
    });

    dispatch({
      type: 'transportation/SET_MONTHLY_STATS',
      payload: { monthlyStats },
    });
  };
}
