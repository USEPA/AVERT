// reducers
import { AppThunk } from 'app/redux/index';
import { MonthlyChanges } from 'app/redux/shared';
// action creators
import { completeStateEmissions } from './stateEmissions';
import { completeMonthlyEmissions } from './monthlyEmissions';

export type StatesAndCounties = {
  [stateId: string]: string[];
};

type DisplacementData = {
  original: number;
  post: number;
  impact: number;
  monthlyChanges: MonthlyChanges;
  stateChanges: {
    [stateId: string]: number;
  };
};

type AnnualDisplacementAction =
  | { type: 'region/SELECT_REGION' }
  | { type: 'annualDisplacement/INCREMENT_PROGRESS' }
  | { type: 'annualDisplacement/START_DISPLACEMENT' }
  | {
      type: 'annualDisplacement/COMPLETE_DISPLACEMENT';
      payload: { statesAndCounties: StatesAndCounties };
    }
  | { type: 'annualDisplacement/DISPLACEMENT_ERROR' }
  | { type: 'annualDisplacement/RESET_DISPLACEMENT' }
  | { type: 'annualDisplacement/REQUEST_GENERATION_DATA' }
  | {
      type: 'annualDisplacement/RECEIVE_GENERATION_DATA';
      payload: { data: DisplacementData };
    }
  | { type: 'annualDisplacement/RECEIVE_GENERATION_ERROR' }
  | { type: 'annualDisplacement/REQUEST_SO2_DATA' }
  | {
      type: 'annualDisplacement/RECEIVE_SO2_DATA';
      payload: { data: DisplacementData };
    }
  | { type: 'annualDisplacement/RECEIVE_SO2_ERROR' }
  | { type: 'annualDisplacement/REQUEST_NOX_DATA' }
  | {
      type: 'annualDisplacement/RECEIVE_NOX_DATA';
      payload: { data: DisplacementData };
    }
  | { type: 'annualDisplacement/RECEIVE_NOX_ERROR' }
  | { type: 'annualDisplacement/REQUEST_CO2_DATA' }
  | {
      type: 'annualDisplacement/RECEIVE_CO2_DATA';
      payload: { data: DisplacementData };
    }
  | { type: 'annualDisplacement/RECEIVE_CO2_ERROR' }
  | { type: 'annualDisplacement/REQUEST_PM25_DATA' }
  | {
      type: 'annualDisplacement/RECEIVE_PM25_DATA';
      payload: { data: DisplacementData };
    }
  | { type: 'annualDisplacement/RECEIVE_PM25_ERROR' };

type Pollutant = {
  isFetching: boolean;
  data: DisplacementData;
  error: boolean;
};

type AnnualDisplacementState = {
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
const initialState: AnnualDisplacementState = {
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
  state: AnnualDisplacementState = initialState,
  action: AnnualDisplacementAction,
): AnnualDisplacementState {
  switch (action.type) {
    case 'region/SELECT_REGION':
    case 'annualDisplacement/RESET_DISPLACEMENT':
      return initialState;

    case 'annualDisplacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
        statesAndCounties: {},
      };

    case 'annualDisplacement/COMPLETE_DISPLACEMENT':
      return {
        ...state,
        status: 'complete',
        statesAndCounties: action.payload.statesAndCounties,
      };

    case 'annualDisplacement/DISPLACEMENT_ERROR':
      return {
        ...state,
        status: 'error',
      };

    case 'annualDisplacement/REQUEST_GENERATION_DATA':
      return {
        ...state,
        generation: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_GENERATION_DATA':
      return {
        ...state,
        generation: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_GENERATION_ERROR':
      return {
        ...state,
        generation: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'annualDisplacement/REQUEST_SO2_DATA':
      return {
        ...state,
        so2: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_SO2_DATA':
      return {
        ...state,
        so2: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_SO2_ERROR':
      return {
        ...state,
        so2: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'annualDisplacement/REQUEST_NOX_DATA':
      return {
        ...state,
        nox: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_NOX_DATA':
      return {
        ...state,
        nox: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_NOX_ERROR':
      return {
        ...state,
        nox: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'annualDisplacement/REQUEST_CO2_DATA':
      return {
        ...state,
        co2: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_CO2_DATA':
      return {
        ...state,
        co2: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_CO2_ERROR':
      return {
        ...state,
        co2: {
          isFetching: false,
          data: initialPollutantData,
          error: true,
        },
      };

    case 'annualDisplacement/REQUEST_PM25_DATA':
      return {
        ...state,
        pm25: {
          isFetching: true,
          data: initialPollutantData,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_PM25_DATA':
      return {
        ...state,
        pm25: {
          isFetching: false,
          data: action.payload.data,
          error: false,
        },
      };

    case 'annualDisplacement/RECEIVE_PM25_ERROR':
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
export function incrementProgress(): AnnualDisplacementAction {
  return {
    type: 'annualDisplacement/INCREMENT_PROGRESS',
  };
}

function fetchGeneration(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'annualDisplacement/REQUEST_GENERATION_DATA' });

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
          type: 'annualDisplacement/RECEIVE_GENERATION_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'annualDisplacement/RECEIVE_GENERATION_ERROR' });
      });
  };
}

function fetchSo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'annualDisplacement/REQUEST_SO2_DATA' });

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
          type: 'annualDisplacement/RECEIVE_SO2_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'annualDisplacement/RECEIVE_SO2_ERROR' });
      });
  };
}

function fetchNox(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'annualDisplacement/REQUEST_NOX_DATA' });

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
          type: 'annualDisplacement/RECEIVE_NOX_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'annualDisplacement/RECEIVE_NOX_ERROR' });
      });
  };
}

function fetchCo2(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'annualDisplacement/REQUEST_CO2_DATA' });

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
          type: 'annualDisplacement/RECEIVE_CO2_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'annualDisplacement/RECEIVE_CO2_ERROR' });
      });
  };
}

function fetchPm25(): AppThunk {
  return (dispatch, getState) => {
    const { region, api, eere } = getState();

    dispatch({ type: 'annualDisplacement/REQUEST_PM25_DATA' });

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
          type: 'annualDisplacement/RECEIVE_PM25_DATA',
          payload: { data: json },
        });
      })
      .catch((error) => {
        dispatch({ type: 'annualDisplacement/RECEIVE_PM25_ERROR' });
      });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'annualDisplacement/START_DISPLACEMENT' });
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
    const { annualDisplacement } = getState();
    const { generation, so2, nox, co2, pm25 } = annualDisplacement;

    // bail if a data source returns an error
    if (generation.error || so2.error || nox.error || co2.error || pm25.error) {
      dispatch({ type: 'annualDisplacement/DISPLACEMENT_ERROR' });
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
      type: 'annualDisplacement/COMPLETE_DISPLACEMENT',
      payload: { statesAndCounties },
    });
    dispatch(completeStateEmissions());
    dispatch(completeMonthlyEmissions());
  };
}

export function resetAnnualDisplacement(): AnnualDisplacementAction {
  return { type: 'annualDisplacement/RESET_DISPLACEMENT' };
}
