import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { eereProfile } from 'app/actions';
import eereReducer, {
  RESET_EERE_INPUTS,
  resetEereInputs,
} from 'app/redux/eere';

const mockStore = configureMockStore([thunk]);
const store = mockStore();

describe('eereReducer', () => {
  const initialState = {
    limits: {
      annualGwh: false,
      constantMwh: false,
      renewables: false,
    },

    valid: true,
    errors: [],

    annualGwh: '',
    constantMwh: '',
    broadProgram: '',
    reduction: '',
    topHours: '',
    windCapacity: '',
    utilitySolar: '',
    rooftopSolar: '',

    status: 'ready',
    hourlyEere: [],

    soft_valid: true,
    soft_exceedances: [],
    soft_top_exceedance_value: 0,
    soft_top_exceedance_timestamp: {},

    hard_valid: true,
    hard_exceedances: [],
    hard_top_exceedance_value: 0,
    hard_top_exceedance_timestamp: {},
  }

  it('should return an initial state', () => {
    expect(eereReducer(undefined, {}))
    .toEqual(initialState);
  });

  it('should handle RESET_EERE_INPUTS', () => {
    expect(eereReducer(undefined, { type: RESET_EERE_INPUTS }))
    .toEqual(initialState);
  });
});

describe('EERE related actions', () => {
  it('resetEereInputs should reset redux state and AVERT engine state', () => {
    eereProfile.topHours = 5;
    store.dispatch(resetEereInputs());

    expect(store.getActions()).toEqual([{ type: RESET_EERE_INPUTS }]);
    expect(eereProfile.topHours).toBe(0);
    expect(eereProfile.topHours).not.toBe(5);
  });
});
