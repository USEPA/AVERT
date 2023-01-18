import type { Pollutant } from 'app/config';

type Aggregation = 'region' | 'state' | 'county';

type Source = 'power' | 'power-vehicles';

export type Unit = 'emissions' | 'percentages';

type Action =
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' }
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
  aggregation: Aggregation;
  regionId: string;
  stateId: string;
  countyName: string;
  pollutants: Pollutant[];
  source: Source;
  unit: Unit;
};

const initialState: State = {
  aggregation: 'region',
  regionId: '',
  stateId: '',
  countyName: '',
  pollutants: [],
  source: 'power',
  unit: 'emissions',
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS': {
      // initial state
      return {
        aggregation: 'region',
        regionId: '',
        stateId: '',
        countyName: '',
        pollutants: [],
        source: 'power',
        unit: 'emissions',
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

      const pollutants = state.pollutants.includes(pollutant)
        ? [...state.pollutants].filter((p) => p !== pollutant)
        : [...state.pollutants].concat(pollutant);

      return {
        ...state,
        pollutants,
      };
    }

    case 'monthlyEmissions/SET_MONTHLY_EMISSIONS_SOURCE': {
      const { source } = action.payload;

      return {
        ...state,
        source,
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
