// reducers
import { AppThunk } from 'app/redux/index';
// config
import { RegionId, Region, regions } from 'app/config';

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
  onshore_wind: number;
  offshore_wind: number | null;
  utility_pv: number;
  rooftop_pv: number;
};

type EereJSON = {
  region: string;
  data: EereDefaultData[];
};

type RegionsAction =
  | {
      type: 'regions/SELECT_REGIONS';
      payload: { regionIds: RegionId[] };
    }
  | {
      type: 'regions/RECEIVE_REGION_RDF';
      payload: {
        regionId: RegionId;
        regionRdf: RdfJSON;
      };
    }
  | {
      type: 'regions/RECEIVE_REGION_DEFAULTS';
      payload: {
        regionId: RegionId;
        regionDefaults: EereJSON;
      };
    };

type RegionState = Region & {
  selected: boolean;
  eereDefaults: EereJSON;
  rdf: RdfJSON;
};

type RegionsState = {
  [key in RegionId]: RegionState;
};

const initialRegionEereDefaults = {
  region: '',
  data: [],
};

const initialRegionRdf = {
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
};

// augment regions data (from config) with additonal fields for each region
const updatedRegions: any = { ...regions };
for (const key in updatedRegions) {
  updatedRegions[key].selected = false;
  updatedRegions[key].eereDefaults = initialRegionEereDefaults;
  updatedRegions[key].rdf = initialRegionRdf;
}

// reducer
const initialState: RegionsState = updatedRegions;

export default function reducer(
  state: RegionsState = initialState,
  action: RegionsAction,
): RegionsState {
  switch (action.type) {
    case 'regions/SELECT_REGIONS':
      const updatedState = { ...state };
      for (const key in state) {
        const regionId = key as RegionId;
        const regionIsSelected = action.payload.regionIds.includes(regionId);
        updatedState[regionId].selected = regionIsSelected;
      }
      return updatedState;

    case 'regions/RECEIVE_REGION_RDF':
      return {
        ...state,
        [action.payload.regionId]: {
          ...state[action.payload.regionId],
          rdf: action.payload.regionRdf,
        },
      };

    case 'regions/RECEIVE_REGION_DEFAULTS': {
      return {
        ...state,
        [action.payload.regionId]: {
          ...state[action.payload.regionId],
          eereDefaults: action.payload.regionDefaults,
        },
      };
    }

    default:
      return state;
  }
}

// action creators
export function selectRegions(regionIds: RegionId[]) {
  return {
    type: 'regions/SELECT_REGIONS',
    payload: { regionIds },
  };
}

export function fetchRegionsData(): AppThunk {
  return (dispatch, getState) => {
    const { api, regions } = getState();

    const selectedRegions: RegionState[] = [];
    for (const key in regions) {
      const region = regions[key as RegionId];
      if (region.selected) selectedRegions.push(region);
    }

    // build up requests of selected regions that haven't yet fetched their RDF
    const rdfRequests: Promise<Response>[] = [];
    selectedRegions.forEach((region) => {
      if (region.rdf.region.region_abbv === '') {
        rdfRequests.push(fetch(`${api.baseUrl}/api/v1/rdf/${region.id}`));
      }
    });

    Promise.all(rdfRequests).then((rdfResponses) => {
      rdfResponses.forEach((rdfResponse) => {
        rdfResponse.json().then((rdfJson: RdfJSON) => {
          const regionId = rdfJson.region.region_abbv;

          dispatch({
            type: 'regions/RECEIVE_REGION_RDF',
            payload: {
              regionId: regionId as RegionId,
              regionRdf: rdfJson,
            },
          });

          fetch(`${api.baseUrl}/api/v1/eere/${regionId}`)
            .then((eereResponse) => eereResponse.json())
            .then((eereJson: EereJSON) => {
              dispatch({
                type: 'regions/RECEIVE_REGION_DEFAULTS',
                payload: {
                  regionId: regionId as RegionId,
                  regionDefaults: eereJson,
                },
              });
            });
        });
      });
    });
  };
}
