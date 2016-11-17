// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';
export const CHANGE_SELECTED_REGION = 'CHANGE_SELECTED_REGION';
export const CHANGE_SELECTED_AGGREGATION = 'CHANGE_SELECTED_AGGREGATION';
export const CHANGE_SELECTED_UNIT = 'CHANGE_SELECTED_UNIT';

// action creators
export const setActiveStep = (number) => {
  return {
    type: CHANGE_ACTIVE_STEP,
    payload: {
      stepNumber: number
    }
  }
};

export const changeSelectedRegion = (text) => {
  return {
    type: CHANGE_SELECTED_REGION,
    payload: {
      regionName: text
    }
  }
};

export const changeSelectedAggregation = (text) => {
  return {
    type: CHANGE_SELECTED_AGGREGATION,
    payload: {
      aggregateLevel: text
    }
  }
};

export const changeSelectedUnit = (text) => {
  return {
    type: CHANGE_SELECTED_UNIT,
    payload: {
      unitType: text
    }
  }
};
