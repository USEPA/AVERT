// actions
import {
  CHANGE_ACTIVE_STEP,
  CHANGE_SELECTED_REGION,
  CHANGE_SELECTED_AGGREGATION,
  CHANGE_SELECTED_UNIT,
  setActiveStep,
  changeSelectedRegion,
  changeSelectedAggregation,
  changeSelectedUnit
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

  describe('changeSelectedRegion', () => {
    it('should have a type of CHANGE_SELECTED_REGION', () => {
      expect(
        changeSelectedRegion().type
      ).toEqual(CHANGE_SELECTED_REGION);
    });

    it('should pass on the region name we pass in', () => {
      expect(
        changeSelectedRegion('California').payload.regionName
      ).toEqual('California');
    });
  });

  describe('changeSelectedAggregation', () => {
    it('should have a type of CHANGE_SELECTED_AGGREGATION', () => {
      expect(
        changeSelectedAggregation().type
      ).toEqual(CHANGE_SELECTED_AGGREGATION);
    });

    it('should pass on the aggregate level we pass in', () => {
      expect(
        changeSelectedAggregation('State').payload.aggregateLevel
      ).toEqual('State');
    });
  });

  describe('changeSelectedUnit', () => {
    it('should have a type of CHANGE_SELECTED_UNIT', () => {
      expect(
        changeSelectedUnit().type
      ).toEqual(CHANGE_SELECTED_UNIT);
    });

    it('should pass on the unit type we pass in', () => {
      expect(
        changeSelectedUnit('Percent change').payload.unitType
      ).toEqual('Percent change');
    });
  });
});
