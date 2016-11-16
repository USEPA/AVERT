// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';
export const CHANGE_SELECTED_REGION = 'CHANGE_SELECTED_REGION';

// action creators
export const setActiveStep = (number) => {
  return {
    type: CHANGE_ACTIVE_STEP,
    payload: {
      stepNumber: number
    }
  }
};

export const changeSelectedRegion = (name) => {
  return {
    type: CHANGE_SELECTED_REGION,
    payload: {
      regionName: name
    }
  }
};
