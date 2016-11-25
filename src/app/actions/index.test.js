// actions
import {
  CHANGE_ACTIVE_STEP,
  setActiveStep,
} from '../actions';

describe('actions', () => {
  describe('setActiveStep', () => {
    it('should have a type of CHANGE_ACTIVE_STEP', () => {
      expect(
        setActiveStep().type
      ).toEqual(CHANGE_ACTIVE_STEP);
    });

    it('should pass on the step number we pass in', () => {
      expect(
        setActiveStep(2).payload.stepNumber
      ).toEqual(2);
    });
  });
});
