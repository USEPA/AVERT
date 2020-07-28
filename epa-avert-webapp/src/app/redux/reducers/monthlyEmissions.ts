// reducers
import { AppThunk } from 'app/redux/index';
import { MonthKey, MonthlyDisplacement } from 'app/redux/reducers/displacement';
// config
import { RegionId } from 'app/config';

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

type PollutantName = 'so2' | 'nox' | 'co2' | 'pm25';

type MonthlyEmissionsAction =
  | { type: 'geography/SELECT_REGION' }
  | { type: 'eere/RESET_EERE_INPUTS' }
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
  | {
      type: 'monthlyEmissions/STORE_FILTERED_DATA';
      payload: {
        pollutant: PollutantName;
        data: MonthlyDisplacement;
      };
    }
  | { type: 'monthlyEmissions/RESET_FILTERED_DATA' };

type MonthlyEmissionsState = {
  selectedAggregation: MonthlyAggregation;
  selectedUnit: MonthlyUnit;
  selectedStateId: string;
  selectedCountyName: string;
  filteredMonthlyData: {
    so2: MonthlyDisplacement;
    nox: MonthlyDisplacement;
    co2: MonthlyDisplacement;
    pm25: MonthlyDisplacement;
  };
};

const initialMonthlyData = {
  month1: { original: 0, postEere: 0 },
  month2: { original: 0, postEere: 0 },
  month3: { original: 0, postEere: 0 },
  month4: { original: 0, postEere: 0 },
  month5: { original: 0, postEere: 0 },
  month6: { original: 0, postEere: 0 },
  month7: { original: 0, postEere: 0 },
  month8: { original: 0, postEere: 0 },
  month9: { original: 0, postEere: 0 },
  month10: { original: 0, postEere: 0 },
  month11: { original: 0, postEere: 0 },
  month12: { original: 0, postEere: 0 },
};

// reducer
const initialState: MonthlyEmissionsState = {
  selectedAggregation: 'region',
  selectedUnit: 'emissions',
  selectedStateId: '',
  selectedCountyName: '',
  filteredMonthlyData: {
    so2: initialMonthlyData,
    nox: initialMonthlyData,
    co2: initialMonthlyData,
    pm25: initialMonthlyData,
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

    case 'monthlyEmissions/STORE_FILTERED_DATA': {
      const { pollutant, data } = action.payload;

      return {
        ...state,
        filteredMonthlyData: {
          ...state.filteredMonthlyData,
          [pollutant]: data,
        },
      };
    }

    case 'eere/RESET_EERE_INPUTS':
    case 'monthlyEmissions/RESET_FILTERED_DATA': {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export function renderMonthlyEmissionsCharts(): AppThunk {
  return (dispatch, getState) => {
    const { displacement, monthlyEmissions } = getState();
    const {
      selectedAggregation: aggregation,
      selectedStateId: stateId,
      selectedCountyName: countyName,
    } = monthlyEmissions;

    (['so2', 'nox', 'co2', 'pm25'] as PollutantName[]).forEach((pollutant) => {
      // aggregate monthly pollutant data for each selected region
      const monthlyPollutantData: MonthlyDisplacement = {
        month1: { original: 0, postEere: 0 },
        month2: { original: 0, postEere: 0 },
        month3: { original: 0, postEere: 0 },
        month4: { original: 0, postEere: 0 },
        month5: { original: 0, postEere: 0 },
        month6: { original: 0, postEere: 0 },
        month7: { original: 0, postEere: 0 },
        month8: { original: 0, postEere: 0 },
        month9: { original: 0, postEere: 0 },
        month10: { original: 0, postEere: 0 },
        month11: { original: 0, postEere: 0 },
        month12: { original: 0, postEere: 0 },
      };

      for (const regionId in displacement.regionalDisplacements) {
        // regional displacement data
        const data = displacement.regionalDisplacements[regionId as RegionId];

        if (data) {
          // set regional monthly pollutant data based on selected aggregation
          const regionalMonthlyPollutantData: MonthlyDisplacement =
            aggregation === 'region'
              ? data[pollutant].regionalData
              : aggregation === 'state' && stateId
              ? data[pollutant].stateData[stateId]
              : aggregation === 'county' && stateId && countyName
              ? data[pollutant].countyData[stateId]?.[countyName]
              : initialMonthlyData;

          // add regional monthly pollutant data to aggregated monthly pollutant
          // data from all selected regions
          for (const key in regionalMonthlyPollutantData) {
            const month = key as MonthKey;
            const { original, postEere } = regionalMonthlyPollutantData[month];
            monthlyPollutantData[month].original += original;
            monthlyPollutantData[month].postEere += postEere;
          }
        }
      }

      dispatch({
        type: 'monthlyEmissions/STORE_FILTERED_DATA',
        payload: {
          pollutant,
          data: monthlyPollutantData,
        },
      });
    });
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
  return { type: 'monthlyEmissions/RESET_FILTERED_DATA' };
}
