// reducers
import { AppThunk } from 'app/redux/index';
// engines
import { avert, eereProfile } from 'app/engines';

// action types
export const REQUEST_REGION_RDF = 'rdfs/REQUEST_REGION_RDF';
export const SET_EERE_LIMITS = 'rdfs/SET_EERE_LIMITS';
export const RECEIVE_REGION_RDF = 'rdfs/RECEIVE_REGION_RDF';
export const REQUEST_REGION_DEFAULTS = 'rdfs/REQUEST_REGION_DEFAULTS';
export const RECEIVE_REGION_DEFAULTS = 'rdfs/RECEIVE_REGION_DEFAULTS';

type RdfsAction =
  | {
      type: typeof RECEIVE_REGION_RDF;
      payload: any; // TODO
    }
  | {
      type: typeof RECEIVE_REGION_DEFAULTS;
      payload: any; // TODO
    };

type RdfsState = {
  defaults: boolean | {}; // TODO
  rdf: boolean | {}; // TODO
};

// reducer
const initialState: RdfsState = {
  defaults: false,
  rdf: false,
};

export default function reducer(
  state = initialState,
  action: RdfsAction,
): RdfsState {
  switch (action.type) {
    case RECEIVE_REGION_RDF:
      return {
        ...state,
        rdf: action.payload,
      };

    case RECEIVE_REGION_DEFAULTS:
      return {
        ...state,
        defaults: action.payload,
      };

    default:
      return state;
  }
}

// action creators
export const fetchRegion = (): AppThunk => {
  return function (dispatch, getState) {
    const { api } = getState();

    dispatch({ type: REQUEST_REGION_RDF });

    // fetch rdf data for region
    return fetch(`${api.baseUrl}/api/v1/rdf/${avert.regionSlug}`)
      .then((response) => response.json())
      .then((json) => {
        avert.rdf = json;

        // set eere profile's first level validation limits (sets 'eereProfile._limits')
        eereProfile.limits = {
          hours: avert.rdf.months.length,
          annualGwh: avert.rdf.maxAnnualGwh,
          renewables: avert.rdf.maxRenewableMwh,
          percent: avert.rdf.maxEEPercent,
        };

        dispatch({
          type: RECEIVE_REGION_RDF,
          payload: json,
        });

        dispatch({
          type: SET_EERE_LIMITS,
          payload: { limits: eereProfile.limits },
        });

        dispatch({ type: REQUEST_REGION_DEFAULTS });

        // fetch eere data for region
        fetch(`${api.baseUrl}/api/v1/eere/${avert.regionSlug}`)
          .then((response) => response.json())
          .then((json) => {
            avert.eereDefaults = json;

            dispatch({
              type: RECEIVE_REGION_DEFAULTS,
              payload: json,
            });
          });
      });
  };
};
