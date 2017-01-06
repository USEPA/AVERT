import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  eereProfile
} from '../../../app/avert';
import eereReducer from '../../../app/reducers/eereReducer';
import {
  RESET_EERE_INPUTS,
  resetEereInputs,
} from '../../../app/actions';


const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('eereReducer', () => {
  const defaultState = {
    status: 'ready',

    limits: { annualGwh: false, constantMwh: false, renewables: false },
    constantMw: '',
    annualGwh: '',
    broadProgram: '',
    reduction: '',
    topHours: '',
    windCapacity: '',
    utilitySolar: '',
    rooftopSolar: '',

    errors: [],
    valid: true,
    exceedances: [],
    top_exceedance_value: 0,
    top_exceedance_hour: 0,
    soft_valid: true,
    soft_exceedances: [],
    soft_top_exceedance_value: 0,
    soft_top_exceedance_hour: 0,
    hard_valid: true,
    hard_exceedances: [],
    hard_top_exceedance_value: 0,
    hard_top_exceedance_hour: 0,
    submitted: false,
    hourlyEere: [],
  };

  it('should return an initial state', () => {
    expect(eereReducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle RESET_EERE_INPUTS', () => {
    expect(eereReducer([], {type: RESET_EERE_INPUTS})).toEqual(defaultState);
  });
});

describe('EERE related actions', () => {
  it('resetEereInputs should reset redux state and AVERT engine state', () => {

    eereProfile.topHours = 5;

    const store = mockStore();
    const expectedActions = [
      { type: 'RESET_EERE_INPUTS' },
    ];

    store.dispatch(resetEereInputs());
    expect(store.getActions()).toEqual(expectedActions);
    expect(eereProfile.topHours).toBe(0);
    expect(eereProfile.topHours).not.toBe(5);
  });
});