// action types
export const CHANGE_ACTIVE_STEP = 'CHANGE_ACTIVE_STEP';

// action creators
export const setActiveStep = (number) => {
  return {
    type: CHANGE_ACTIVE_STEP,
    payload: {
      stepNumber: number
    }
  }
};
