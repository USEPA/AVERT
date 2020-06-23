// reducers
import { AppThunk } from 'app/redux/index';
import { RegionState } from 'app/redux/reducers/regions';
// action creators
import { completeStateEmissions } from './stateEmissions';
import { MonthlyChanges, completeMonthlyEmissions } from './monthlyEmissions';
// config
import { RegionId } from 'app/config';

export type StatesAndCounties = {
  [stateId: string]: string[];
};

type PollutantDisplacementData = {
  original: number;
  post: number;
  impact: number;
  monthlyChanges: MonthlyChanges;
  stateChanges: {
    [stateId: string]: number;
  };
};

type DisplacementAction =
  | { type: 'regions/SELECT_REGIONS' }
  | { type: 'displacement/INCREMENT_PROGRESS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | {
      type: 'displacement/COMPLETE_DISPLACEMENT';
      payload: { statesAndCounties: StatesAndCounties };
    }
  | { type: 'displacement/DISPLACEMENT_ERROR' }
  | { type: 'displacement/RESET_DISPLACEMENT' }
  | { type: 'displacement/REQUEST_GENERATION_DATA' }
  | {
      type: 'displacement/RECEIVE_GENERATION_DATA';
      payload: { data: PollutantDisplacementData };
    }
  | { type: 'displacement/RECEIVE_GENERATION_ERROR' }
  | { type: 'displacement/REQUEST_SO2_DATA' }
  | {
      type: 'displacement/RECEIVE_SO2_DATA';
      payload: { data: PollutantDisplacementData };
    }
  | { type: 'displacement/RECEIVE_SO2_ERROR' }
  | { type: 'displacement/REQUEST_NOX_DATA' }
  | {
      type: 'displacement/RECEIVE_NOX_DATA';
      payload: { data: PollutantDisplacementData };
    }
  | { type: 'displacement/RECEIVE_NOX_ERROR' }
  | { type: 'displacement/REQUEST_CO2_DATA' }
  | {
      type: 'displacement/RECEIVE_CO2_DATA';
      payload: { data: PollutantDisplacementData };
    }
  | { type: 'displacement/RECEIVE_CO2_ERROR' }
  | { type: 'displacement/REQUEST_PM25_DATA' }
  | {
      type: 'displacement/RECEIVE_PM25_DATA';
      payload: { data: PollutantDisplacementData };
    }
  | { type: 'displacement/RECEIVE_PM25_ERROR' };

type PollutantState = {
  isFetching: boolean;
  data: PollutantDisplacementData;
  error: boolean;
};

type Pollutant = 'generation' | 'so2' | 'nox' | 'co2' | 'pm25';

type DisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  statesAndCounties: StatesAndCounties;
  generation: PollutantState;
  so2: PollutantState;
  nox: PollutantState;
  co2: PollutantState;
  pm25: PollutantState;
};

const initialPollutantData = {
  original: 0,
  post: 0,
  impact: 0,
  monthlyChanges: {
    emissions: {
      region: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      state: {},
      county: {},
    },
    percentages: {
      region: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      },
      state: {},
      county: {},
    },
  },
  stateChanges: {},
};

// reducer
const initialState: DisplacementState = {
  status: 'ready',
  statesAndCounties: {},
  generation: {
    isFetching: false,
    data: initialPollutantData,
    error: false,
  },
  so2: {
    isFetching: false,
    data: initialPollutantData,
    error: false,
  },
  nox: {
    isFetching: false,
    data: initialPollutantData,
    error: false,
  },
  co2: {
    isFetching: false,
    data: initialPollutantData,
    error: false,
  },
  pm25: {
    isFetching: false,
    data: initialPollutantData,
    error: false,
  },
};

export default function reducer(
  state: DisplacementState = initialState,
  action: DisplacementAction,
): DisplacementState {
  switch (action.type) {
    case 'regions/SELECT_REGIONS':
    case 'displacement/RESET_DISPLACEMENT':
      return initialState;

    case 'displacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
        statesAndCounties: {},
      };

    case 'displacement/COMPLETE_DISPLACEMENT':
      return {
        ...state,
        status: 'complete',
        statesAndCounties: action.payload.statesAndCounties,
      };

    case 'displacement/DISPLACEMENT_ERROR':
      return {
        ...state,
        status: 'error',
      };

    case 'displacement/REQUEST_GENERATION_DATA':
      return {
        ...state,
        generation: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'displacement/RECEIVE_GENERATION_DATA':
      return {
        ...state,
        generation: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'displacement/RECEIVE_GENERATION_ERROR':
      return {
        ...state,
        generation: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'displacement/REQUEST_SO2_DATA':
      return {
        ...state,
        so2: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'displacement/RECEIVE_SO2_DATA':
      return {
        ...state,
        so2: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'displacement/RECEIVE_SO2_ERROR':
      return {
        ...state,
        so2: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'displacement/REQUEST_NOX_DATA':
      return {
        ...state,
        nox: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'displacement/RECEIVE_NOX_DATA':
      return {
        ...state,
        nox: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'displacement/RECEIVE_NOX_ERROR':
      return {
        ...state,
        nox: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'displacement/REQUEST_CO2_DATA':
      return {
        ...state,
        co2: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'displacement/RECEIVE_CO2_DATA':
      return {
        ...state,
        co2: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'displacement/RECEIVE_CO2_ERROR':
      return {
        ...state,
        co2: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'displacement/REQUEST_PM25_DATA':
      return {
        ...state,
        pm25: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'displacement/RECEIVE_PM25_DATA':
      return {
        ...state,
        pm25: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'displacement/RECEIVE_PM25_ERROR':
      return {
        ...state,
        pm25: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    default:
      return state;
  }
}

// action creators
export function incrementProgress(): DisplacementAction {
  return {
    type: 'displacement/INCREMENT_PROGRESS',
  };
}

function fetchDisplacementData(pollutant: Pollutant): AppThunk {
  return (dispatch, getState) => {
    const { api, regions, eere } = getState();

    // TODO: determine how to handle when multiple regions are selected
    const selectedRegions: RegionState[] = [];
    for (const key in regions) {
      const region = regions[key as RegionId];
      if (region.selected) selectedRegions.push(region);
    }
    const region = selectedRegions[0];

    dispatch({ type: `displacement/REQUEST_${pollutant.toUpperCase()}_DATA` });

    // post calculated hourly eere load for region and
    // receive calculated displacement data for pollutant
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: region.id,
        hourlyLoad: eere.hourlyEere.map((hour) => hour.final_mw),
      }),
    };

    return fetch(`${api.baseUrl}/api/v1/${pollutant}`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: `displacement/RECEIVE_${pollutant.toUpperCase()}_DATA`,
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({
          type: `displacement/RECEIVE_${pollutant.toUpperCase()}_ERROR`,
        });
      });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'displacement/START_DISPLACEMENT' });
    dispatch(incrementProgress());

    dispatch(fetchDisplacementData('generation'));
    dispatch(fetchDisplacementData('so2'));
    dispatch(fetchDisplacementData('nox'));
    dispatch(fetchDisplacementData('co2'));
    dispatch(fetchDisplacementData('pm25'));

    dispatch(receiveDisplacement());
  };
}

function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { displacement } = getState();
    const { generation, so2, nox, co2, pm25 } = displacement;

    // bail if a data source returns an error
    if (generation.error || so2.error || nox.error || co2.error || pm25.error) {
      dispatch({ type: 'displacement/DISPLACEMENT_ERROR' });
      return;
    }

    // recursively call function if data is still fetching
    if (
      generation.isFetching ||
      so2.isFetching ||
      nox.isFetching ||
      co2.isFetching ||
      pm25.isFetching
    ) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    // build up statesAndCounties from monthlyChanges data
    const so2countyEmissions = so2.data.monthlyChanges.emissions.county;
    const statesAndCounties: StatesAndCounties = {};
    for (const stateId in so2countyEmissions) {
      const stateCountyNames = Object.keys(so2countyEmissions[stateId]).sort();
      statesAndCounties[stateId] = stateCountyNames;
    }

    dispatch(incrementProgress());
    dispatch({
      type: 'displacement/COMPLETE_DISPLACEMENT',
      payload: { statesAndCounties },
    });
    dispatch(completeStateEmissions());
    dispatch(completeMonthlyEmissions());
  };
}

export function resetDisplacement(): DisplacementAction {
  return { type: 'displacement/RESET_DISPLACEMENT' };
}
