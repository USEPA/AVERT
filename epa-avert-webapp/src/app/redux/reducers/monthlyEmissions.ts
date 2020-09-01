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
    };

type MonthlyEmissionsState = {
  selectedAggregation: MonthlyAggregation;
  selectedUnit: MonthlyUnit;
  selectedRegionId: string;
  selectedStateId: string;
  selectedCountyName: string;
};

// reducer
const initialState: MonthlyEmissionsState = {
  selectedAggregation: 'region',
  selectedUnit: 'emissions',
  selectedRegionId: '',
  selectedStateId: '',
  selectedCountyName: '',
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

    default: {
      return state;
    }
  }
}

export function selectMonthlyAggregation(
  selectedAggregation: MonthlyAggregation,
) {
  return {
    type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION',
    payload: { selectedAggregation },
  };
}

export function selectMonthlyUnit(selectedUnit: MonthlyUnit) {
  return {
    type: 'monthlyEmissions/SELECT_MONTHLY_UNIT',
    payload: { selectedUnit },
  };
}

export function selectMonthlyRegion(selectedRegionId: string) {
  return {
    type: 'monthlyEmissions/SELECT_MONTHLY_REGION',
    payload: { selectedRegionId },
  };
}

export function selectMonthlyState(selectedStateId: string) {
  return {
    type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
    payload: { selectedStateId },
  };
}

export function selectMonthlyCounty(selectedCountyName: string) {
  return {
    type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
    payload: { selectedCountyName },
  };
}

export function resetMonthlyEmissions() {
  return { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };
}
