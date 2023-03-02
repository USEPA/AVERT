import type { AppThunk } from 'app/redux/index';
import type { Pollutant, StateId } from 'app/config';

type StatesAndCounties = Partial<{ [key in StateId]: string[] }>;

export type Aggregation = 'region' | 'state' | 'county';

export type Source = 'power' | 'vehicles';

export type Unit = 'emissions' | 'percentages';

type Action =
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' }
  | {
      type: 'monthlyEmissions/SET_STATES_AND_COUNTIES';
      payload: { statesAndCounties: StatesAndCounties };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_AGGREGATION';
      payload: { aggregation: Aggregation };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_REGION_ID';
      payload: { regionId: string };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_STATE_ID';
      payload: { stateId: string };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_COUNTY_NAME';
      payload: { countyName: string };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_POLLUTANT';
      payload: { pollutant: Pollutant };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_SOURCE';
      payload: { source: Source };
    }
  | {
      type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_UNIT';
      payload: { unit: Unit };
    };

type State = {
  statesAndCounties: StatesAndCounties;
  aggregation: Aggregation;
  regionId: string;
  stateId: string;
  countyName: string;
  pollutants: Pollutant[];
  sources: Source[];
  unit: Unit;
};

const initialState: State = {
  statesAndCounties: {},
  aggregation: 'region',
  regionId: '',
  stateId: '',
  countyName: '',
  pollutants: [],
  sources: ['power'],
  unit: 'emissions',
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS': {
      return initialState;
    }

    case 'monthlyEmissions/SET_STATES_AND_COUNTIES': {
      const { statesAndCounties } = action.payload;

      return {
        ...state,
        statesAndCounties,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_AGGREGATION': {
      const { aggregation } = action.payload;

      return {
        ...state,
        aggregation,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_REGION_ID': {
      const { regionId } = action.payload;

      return {
        ...state,
        regionId,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_STATE_ID': {
      const { stateId } = action.payload;

      return {
        ...state,
        stateId,
        countyName: '',
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_COUNTY_NAME': {
      const { countyName } = action.payload;

      return {
        ...state,
        countyName,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_POLLUTANT': {
      const { pollutant } = action.payload;

      const order = ['so2', 'nox', 'co2', 'pm25', 'vocs', 'nh3'];

      const pollutants = state.pollutants.includes(pollutant)
        ? [...state.pollutants].filter((p) => p !== pollutant)
        : [...state.pollutants].concat(pollutant);

      return {
        ...state,
        pollutants: pollutants.sort(
          (a, b) => order.indexOf(a) - order.indexOf(b),
        ),
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_SOURCE': {
      const { source } = action.payload;

      const sources = state.sources.includes(source)
        ? [...state.sources].filter((s) => s !== source)
        : [...state.sources].concat(source);

      return {
        ...state,
        sources,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_UNIT': {
      const { unit } = action.payload;

      return {
        ...state,
        unit,
      };
    }

    default: {
      return state;
    }
  }
}

export function resetMonthlyEmissions() {
  return { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };
}

export function setMonthlyEmissionsAggregation(aggregation: Aggregation) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_AGGREGATION',
    payload: { aggregation },
  };
}

export function setMonthlyEmissionsRegionId(regionId: string) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_REGION_ID',
    payload: { regionId },
  };
}

export function setMonthlyEmissionsStateId(stateId: string) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_STATE_ID',
    payload: { stateId },
  };
}

export function setMonthlyEmissionsCountyName(countyName: string) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_COUNTY_NAME',
    payload: { countyName },
  };
}

export function setMonthlyEmissionsPollutant(pollutant: Pollutant) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_POLLUTANT',
    payload: { pollutant },
  };
}

export function setMonthlyEmissionsSource(source: Source) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_SOURCE',
    payload: { source },
  };
}

export function setMonthlyEmissionsUnit(unit: Unit) {
  return {
    type: 'monthlyEmissions/SET_MONTHLY_EMISSIONS_UNIT',
    payload: { unit },
  };
}

/**
 * Called every time the `results` reducer's `calculateEmissionsChanges()`
 * function is called.
 *
 * _(e.g. whenever the "Get Results" button is clicked on the "Set Energy
 * Impacts" page)_
 */
export function setStatesAndCounties(): AppThunk {
  return (dispatch, getState) => {
    const { results } = getState();
    const { emissionsChanges } = results;

    if (emissionsChanges.status !== 'success') return;

    const statesAndCounties: StatesAndCounties = {};

    Object.values(emissionsChanges.data).forEach((egu) => {
      statesAndCounties[egu.state as StateId] ??= [];
      const state = statesAndCounties[egu.state as StateId];
      if (state && !state.includes(egu.county)) state.push(egu.county);
    });

    // sort county names within each state
    for (const key in statesAndCounties) {
      const stateId = key as StateId;
      statesAndCounties[stateId] = statesAndCounties[stateId]?.sort();
    }

    dispatch({
      type: 'monthlyEmissions/SET_STATES_AND_COUNTIES',
      payload: { statesAndCounties },
    });
  };
}
