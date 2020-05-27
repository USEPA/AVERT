// reducers
import { AppThunk } from 'app/redux/index';

export type RegionalLoadData = {
  day: number;
  hour: number;
  hour_of_year: number;
  hourly_limit: number;
  month: number;
  regional_load_mw: number;
  year: number;
};

type RdfJSON = {
  region: {
    region_abbv: string;
    region_name: string;
    region_states: string; // comma seperated string of state abbreviations
  };
  run: {
    file_name: string[];
    mc_gen_runs: number;
    mc_runs: number;
    region_id: number;
    year: number;
  };
  limits: {
    created_at: null;
    id: number;
    max_ee_percent: number;
    max_ee_yearly_gwh: number;
    max_solar_wind_mwh: number;
    region_id: number;
    updated_at: null;
    year: number;
  };
  regional_load: RegionalLoadData[];
  load_bin_edges: number[];
  data: {
    generation: any;
    heat: any;
    heat_not: any;
    co2: any;
    co2_not: any;
    nox: any;
    nox_not: any;
    pm25: any;
    pm25_not: any;
    so2: any;
    so2_not: any;
  };
};

export type EereDefaultData = {
  date: string;
  hour: number;
  wind: number;
  utility_pv: number;
  rooftop_pv: number;
};

type EereJSON = {
  region: string;
  data: EereDefaultData[];
};

type RdfsAction =
  | {
      type: 'rdfs/RECEIVE_REGION_RDF';
      payload: RdfJSON;
    }
  | {
      type: 'rdfs/RECEIVE_REGION_DEFAULTS';
      payload: EereJSON;
    };

type RdfsState = {
  defaults: EereJSON;
  rdf: RdfJSON;
};

// reducer
const initialState: RdfsState = {
  defaults: {
    region: '',
    data: [],
  },
  rdf: {
    region: {
      region_abbv: '',
      region_name: '',
      region_states: '',
    },
    run: {
      file_name: [],
      mc_gen_runs: 0,
      mc_runs: 0,
      region_id: 0,
      year: 0,
    },
    limits: {
      created_at: null,
      id: 0,
      max_ee_percent: 0,
      max_ee_yearly_gwh: 0,
      max_solar_wind_mwh: 0,
      region_id: 0,
      updated_at: null,
      year: 0,
    },
    regional_load: [],
    load_bin_edges: [],
    data: {
      generation: null,
      heat: null,
      heat_not: null,
      co2: null,
      co2_not: null,
      nox: null,
      nox_not: null,
      pm25: null,
      pm25_not: null,
      so2: null,
      so2_not: null,
    },
  },
};

export default function reducer(
  state: RdfsState = initialState,
  action: RdfsAction,
): RdfsState {
  switch (action.type) {
    case 'rdfs/RECEIVE_REGION_RDF':
      return {
        ...state,
        rdf: action.payload,
      };

    case 'rdfs/RECEIVE_REGION_DEFAULTS':
      return {
        ...state,
        defaults: action.payload,
      };

    default:
      return state;
  }
}

// action creators
export function fetchRegion(): AppThunk {
  return (dispatch, getState) => {
    const { region, api } = getState();

    dispatch({ type: 'rdfs/REQUEST_REGION_RDF' });

    // fetch rdf data for region
    return fetch(`${api.baseUrl}/api/v1/rdf/${region.slug}`)
      .then((response) => response.json())
      .then((json: RdfJSON) => {
        const {
          max_ee_yearly_gwh,
          max_solar_wind_mwh,
          max_ee_percent,
        } = json.limits;

        dispatch({
          type: 'rdfs/RECEIVE_REGION_RDF',
          payload: json,
        });

        // calculate hourlyMwh from annualGwh (total for year)
        const hourlyMwh =
          (max_ee_yearly_gwh * 1000) / json.regional_load.length;

        dispatch({
          type: 'rdfs/SET_EERE_LIMITS',
          payload: {
            limits: {
              annualGwh: max_ee_yearly_gwh * 2,
              constantMwh: Math.round(hourlyMwh * 2 * 100) / 100,
              renewables: max_solar_wind_mwh * 2,
              percent: max_ee_percent * 2,
            },
          },
        });

        dispatch({ type: 'rdfs/REQUEST_REGION_DEFAULTS' });

        // fetch eere data for region
        fetch(`${api.baseUrl}/api/v1/eere/${region.slug}`)
          .then((response) => response.json())
          .then((json: EereJSON) => {
            dispatch({
              type: 'rdfs/RECEIVE_REGION_DEFAULTS',
              payload: json,
            });
          });
      });
  };
}
