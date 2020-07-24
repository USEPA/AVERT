// reducers
import { AppThunk } from 'app/redux/index';

export type DataByMonth = {
  [month in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12]: number;
};

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

export type MonthlyChanges = {
  emissions: {
    region: DataByMonth;
    state: { [stateId: string]: DataByMonth };
    county: { [stateId: string]: { [countyName: string]: DataByMonth } };
  };
  percentages: {
    region: DataByMonth;
    state: { [stateId: string]: DataByMonth };
    county: { [stateId: string]: { [countyName: string]: DataByMonth } };
  };
};

type MonthlyEmissionsAction =
  | { type: 'geography/SELECT_REGION' }
  | { type: 'eere/RESET_EERE_INPUTS' }
  | {
      type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS';
      payload: {
        so2: MonthlyChanges;
        nox: MonthlyChanges;
        co2: MonthlyChanges;
        pm25: MonthlyChanges;
      };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
      payload: { selectedAggregation: MonthlyAggregation };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT';
      payload: { selectedUnit: MonthlyUnit };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE';
      payload: { selectedStateId: string };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
      payload: { selectedCountyName: string };
    }
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };

type MonthlyEmissionsState = {
  selectedAggregation: MonthlyAggregation;
  selectedUnit: MonthlyUnit;
  selectedStateId: string;
  selectedCountyName: string;
  output: {
    so2: number[];
    nox: number[];
    co2: number[];
    pm25: number[];
  };
};

// reducer
const initialState: MonthlyEmissionsState = {
  selectedAggregation: 'region',
  selectedUnit: 'emissions',
  selectedStateId: '',
  selectedCountyName: '',
  output: {
    so2: [],
    nox: [],
    co2: [],
    pm25: [],
  },
};

export default function reducer(
  state: MonthlyEmissionsState = initialState,
  action: MonthlyEmissionsAction,
): MonthlyEmissionsState {
  switch (action.type) {
    case 'geography/SELECT_REGION': {
      return initialState;
    }

    case 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION': {
      const { selectedAggregation } = action.payload;

      return {
        ...state,
        selectedAggregation,
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_UNIT': {
      const { selectedUnit } = action.payload;

      return {
        ...state,
        selectedUnit,
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_STATE': {
      const { selectedStateId } = action.payload;

      return {
        ...state,
        selectedStateId,
        selectedCountyName: '',
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_COUNTY': {
      const { selectedCountyName } = action.payload;

      return {
        ...state,
        selectedCountyName,
      };
    }

    case 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS': {
      const {
        selectedUnit,
        selectedAggregation,
        selectedStateId,
        selectedCountyName,
      } = state;

      const emissionData: {
        [pollutant in 'so2' | 'nox' | 'co2' | 'pm25']: number[];
      } = {
        so2: [],
        nox: [],
        co2: [],
        pm25: [],
      };

      // populate emissionData with data from action (pollutant data from store)
      (Object.keys(emissionData) as ('so2' | 'nox' | 'co2' | 'pm25')[]).forEach(
        (pollutant) => {
          if (selectedAggregation === 'region') {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][selectedUnit].region,
            );
          }

          if (selectedAggregation === 'state' && selectedStateId) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][selectedUnit].state[selectedStateId],
            );
          }

          if (
            selectedAggregation === 'county' &&
            selectedStateId &&
            selectedCountyName
          ) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][selectedUnit].county[selectedStateId][
                selectedCountyName
              ],
            );
          }
        },
      );

      return {
        ...state,
        output: emissionData,
      };
    }

    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS':
    case 'eere/RESET_EERE_INPUTS': {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export function renderMonthlyEmissionsCharts(): AppThunk {
  return (dispatch, getState) => {
    // const { displacement } = getState();
    // const { so2, nox, co2, pm25 } = displacement;
    // dispatch({
    //   type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS',
    //   payload: {
    //     so2: so2.data.monthlyChanges,
    //     nox: nox.data.monthlyChanges,
    //     co2: co2.data.monthlyChanges,
    //     pm25: pm25.data.monthlyChanges,
    //   },
    // });
  };
}

export function selectMonthlyAggregation(
  selectedAggregation: MonthlyAggregation,
): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION',
      payload: { selectedAggregation },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyUnit(selectedUnit: MonthlyUnit): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT',
      payload: { selectedUnit },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyState(selectedStateId: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
      payload: { selectedStateId },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyCounty(selectedCountyName: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
      payload: { selectedCountyName },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function resetMonthlyEmissions(): MonthlyEmissionsAction {
  return { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };
}
