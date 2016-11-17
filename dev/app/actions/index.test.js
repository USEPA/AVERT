import {
  CHANGE_ACTIVE_STEP,
  CHANGE_SELECTED_REGION,
  setActiveStep,
  changeSelectedRegion
} from '../actions';

describe('actions', () => {
  describe('setActiveStep', () => {
    it('should have a type of CHANGE_ACTIVE_STEP', () => {
      expect(setActiveStep().type).toEqual(CHANGE_ACTIVE_STEP);
    });

    it('should pass on the step number we pass in', () => {
      const number = 2;
      expect(setActiveStep(number).payload.stepNumber).toEqual(number);
    });
  });

  describe('changeSelectedRegion', () => {
    it('should have a type of CHANGE_SELECTED_REGION', () => {
      expect(changeSelectedRegion().type).toEqual(CHANGE_SELECTED_REGION);
    });

    it('should pass on the region name we pass in', () => {
      const name = 'California';
      expect(changeSelectedRegion(name).payload.regionName).toEqual(name);
    });
  });
});
