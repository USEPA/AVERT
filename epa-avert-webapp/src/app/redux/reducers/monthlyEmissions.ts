// reducers
import { AppThunk } from 'app/redux/index';
import {
  PollutantName,
  MonthKey,
  MonthlyDisplacement,
} from 'app/redux/reducers/displacement';
// config
import { RegionId } from 'app/config';

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

type MonthlyEmissionsAction =
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
      payload: { selectedAggregation: MonthlyAggregation };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT';
      payload: { selectedUnit: MonthlyUnit };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_REGION';
      payload: { selectedRegionId: string };
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
    };

type MonthlyEmissionsState = {
  selectedAggregation: MonthlyAggregation;
  selectedUnit: MonthlyUnit;
  selectedRegionId: string;
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
  selectedRegionId: '',
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
    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS': {
      // initial state
      return {
        selectedAggregation: 'region',
        selectedUnit: 'emissions',
        selectedRegionId: '',
        selectedStateId: '',
        selectedCountyName: '',
        filteredMonthlyData: {
          so2: initialMonthlyData,
          nox: initialMonthlyData,
          co2: initialMonthlyData,
          pm25: initialMonthlyData,
        },
      };
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

    case 'monthlyEmissions/SELECT_MONTHLY_REGION': {
      const { selectedRegionId } = action.payload;

      return {
        ...state,
        selectedRegionId,
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

    default: {
      return state;
    }
  }
}

export function updateFilteredEmissionsData(): AppThunk {
  return (dispatch, getState) => {
    const { geography, displacement, monthlyEmissions } = getState();
    const {
      selectedAggregation: aggregation,
      selectedRegionId: regionId,
      selectedStateId: stateId,
      selectedCountyName: countyName,
    } = monthlyEmissions;

    // store filtered monthly data for each pollutant
    for (const pollutant of ['so2', 'nox', 'co2', 'pm25'] as PollutantName[]) {
      // initial combined monthly pollutant data may be conditionally overwritten
      const combinedMonthlyData: MonthlyDisplacement = {
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

      // if a state is selected, the selected aggregation is region, a region
      // region has not been selected, and there is more than one region, use
      // the initially set (empty) combined monthly pollutant data
      if (
        geography.focus === 'states' &&
        aggregation === 'region' &&
        regionId === '' &&
        Object.keys(displacement.regionalDisplacements).length > 1
      ) {
        dispatch({
          type: 'monthlyEmissions/STORE_FILTERED_DATA',
          payload: {
            pollutant,
            data: combinedMonthlyData,
          },
        });

        continue;
      }

      // if a state is selected, the selected aggregation is region, and a
      // region has been selected, use only the selected region's monthly
      // pollutant data
      if (
        geography.focus === 'states' &&
        aggregation === 'region' &&
        regionId !== '' &&
        regionId !== 'ALL'
      ) {
        const data = displacement.regionalDisplacements[regionId as RegionId];

        if (data) {
          dispatch({
            type: 'monthlyEmissions/STORE_FILTERED_DATA',
            payload: {
              pollutant,
              data: data[pollutant].regionalData,
            },
          });

          continue;
        }
      }

      // aggregate monthly pollutant data for each of the selected regions
      for (const key in displacement.regionalDisplacements) {
        // regional displacement data
        const data = displacement.regionalDisplacements[key as RegionId];

        if (data) {
          // set regional monthly pollutant data based on selected aggregation
          const regionalMonthlyData =
            aggregation === 'region'
              ? data[pollutant].regionalData
              : aggregation === 'state' && stateId
              ? data[pollutant].stateData[stateId]
              : aggregation === 'county' && stateId && countyName
              ? data[pollutant].countyData[stateId]?.[countyName]
              : initialMonthlyData;

          // add regional monthly pollutant data to aggregated monthly
          // pollutant data (`combinedMonthlyData`) from all selected regions
          for (const key in regionalMonthlyData) {
            const month = key as MonthKey;
            const { original, postEere } = regionalMonthlyData[month];
            combinedMonthlyData[month].original += original;
            combinedMonthlyData[month].postEere += postEere;
          }
        }
      }

      dispatch({
        type: 'monthlyEmissions/STORE_FILTERED_DATA',
        payload: {
          pollutant,
          data: combinedMonthlyData,
        },
      });
    }
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
    dispatch(updateFilteredEmissionsData());
  };
}

export function selectMonthlyUnit(selectedUnit: MonthlyUnit): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT',
      payload: { selectedUnit },
    });
    dispatch(updateFilteredEmissionsData());
  };
}

export function selectMonthlyRegion(selectedRegionId: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_REGION',
      payload: { selectedRegionId },
    });
    dispatch(updateFilteredEmissionsData());
  };
}

export function selectMonthlyState(selectedStateId: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
      payload: { selectedStateId },
    });
    dispatch(updateFilteredEmissionsData());
  };
}

export function selectMonthlyCounty(selectedCountyName: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
      payload: { selectedCountyName },
    });
    dispatch(updateFilteredEmissionsData());
  };
}

export function resetMonthlyEmissions(): MonthlyEmissionsAction {
  return { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };
}
