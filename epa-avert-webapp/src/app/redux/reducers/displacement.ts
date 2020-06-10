// reducers
import { AppThunk } from 'app/redux/index';
import { MonthlyChanges } from 'app/redux/shared';
// action creators
import { completeStateEmissions } from './stateEmissions';
import { completeMonthlyEmissions } from './monthlyEmissions';

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
  | { type: 'region/SELECT_REGION' }
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

type Pollutant = {
  isFetching: boolean;
  data: PollutantDisplacementData;
  error: boolean;
};

type DisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  statesAndCounties: StatesAndCounties;
  generation: Pollutant;
  so2: Pollutant;
  nox: Pollutant;
  co2: Pollutant;
  pm25: Pollutant;
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
    case 'region/SELECT_REGION':
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

function fetchGeneration(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_GENERATION_DATA' });

    // post generation data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/generation`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'displacement/RECEIVE_GENERATION_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'displacement/RECEIVE_GENERATION_ERROR' });
      });
  };
}

function fetchSo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_SO2_DATA' });

    // post so2 data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/so2`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'displacement/RECEIVE_SO2_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'displacement/RECEIVE_SO2_ERROR' });
      });
  };
}

function fetchNox(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_NOX_DATA' });

    // post nox data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/nox`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'displacement/RECEIVE_NOX_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'displacement/RECEIVE_NOX_ERROR' });
      });
  };
}

function fetchCo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_CO2_DATA' });

    // post co2 data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/co2`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'displacement/RECEIVE_CO2_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'displacement/RECEIVE_CO2_ERROR' });
      });
  };
}

function fetchPm25(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_PM25_DATA' });

    // post pm25 data for region and receive calculated displacement data
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

    return fetch(`${api.baseUrl}/api/v1/pm25`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(incrementProgress());
        dispatch({
          type: 'displacement/RECEIVE_PM25_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'displacement/RECEIVE_PM25_ERROR' });
      });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'displacement/START_DISPLACEMENT' });
    dispatch(incrementProgress());

    // fetch generation, so2, nox, co2, and pm25
    dispatch(fetchGeneration());
    dispatch(fetchSo2());
    dispatch(fetchNox());
    dispatch(fetchCo2());
    dispatch(fetchPm25());

    dispatch(receiveDisplacement());
  };
}

export function receiveDisplacement(): AppThunk {
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
