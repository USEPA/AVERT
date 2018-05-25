import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import monthlyEmissionsReducer, {
  COMPLETE_MONTHLY_EMISSIONS,
  SELECT_MONTHLY_UNIT,
  SELECT_MONTHLY_STATE,
  SELECT_MONTHLY_COUNTY,
} from 'app/redux/monthlyEmissions';

const mockStore = configureMockStore([thunk]);

describe('monthlyEmissions', () => {
  describe('Reducer', () => {
    it('should return an initial state', () => {
      expect(monthlyEmissionsReducer(undefined, {})).toEqual({
        status: 'select_region',
        aggregation: 'region',
        unit: 'emissions',
        availableStates: [],
        availableCounties: [],
        selectedState: '',
        selectedCounty: '',
        output: {
          so2: [],
          nox: [],
          co2: [],
          pm25: [],
        },
        downloadableCountyData: [],
        downloadableCobraData: [],
      });
    });

    it('should handle COMPLETE_MONTHLY_EMISSIONS', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: COMPLETE_MONTHLY_EMISSIONS,
          availableStates: ['Maryland', 'Virginia'],
        }),
      ).toEqual({
        status: 'complete',
        availableStates: ['Maryland', 'Virginia'],
      });
    });

    it('should handle SELECT_MONTHLY_STATE', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_STATE,
          selectedState: 'Virginia',
          availableCounties: ['Arlington County'],
        }),
      ).toEqual({
        selectedState: 'Virginia',
        selectedCounty: '',
        availableCounties: ['Arlington County'],
      });
    });

    it('should handle SELECT_MONTHLY_COUNTY', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_COUNTY,
          selectedCounty: 'Arlington County',
        }),
      ).toEqual({
        selectedCounty: 'Arlington County',
      });
    });

    it('should handle SELECT_MONTHLY_UNIT', () => {
      expect(
        monthlyEmissionsReducer([], {
          type: SELECT_MONTHLY_UNIT,
          unit: 'percentages',
        }),
      ).toEqual({
        unit: 'percentages',
      });
    });
  });
});
