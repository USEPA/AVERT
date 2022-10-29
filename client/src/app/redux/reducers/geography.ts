// reducers
import { AppThunk } from 'app/redux/index';
import {
  storeRegionTransportationData,
  storeEERETransportationData,
} from 'app/redux/reducers/transportation';
// config
import {
  RdfDataKey,
  RegionId,
  Region,
  regions,
  StateId,
  State,
  states,
} from 'app/config';

type GeographicFocus = 'regions' | 'states';

export type RegionalLoadData = {
  day: number;
  hour: number;
  hour_of_year: number;
  hourly_limit: number;
  month: number;
  regional_load_mw: number;
  year: number;
};

export type EGUData = {
  state: StateId;
  county: string;
  lat: number;
  lon: number;
  fuel_type: string;
  orispl_code: number;
  unit_code: string;
  full_name: string;
  infreq_emissions_flag: 0 | 1;
  medians: number[];
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
    [key in RdfDataKey]: EGUData[];
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

type GeographyAction =
  | {
      type: 'geography/SELECT_GEOGRAPHY';
      payload: { focus: GeographicFocus };
    }
  | {
      type: 'geography/SELECT_REGION';
      payload: { regionId: RegionId };
    }
  | {
      type: 'geography/SELECT_STATE';
      payload: { stateId: StateId };
    }
  | { type: 'geography/REQUEST_SELECTED_REGIONS_DATA' }
  | { type: 'geography/RECEIVE_SELECTED_REGIONS_DATA' }
  | {
      type: 'geography/RECEIVE_REGION_RDF';
      payload: {
        regionId: RegionId;
        regionRdf: RdfJSON;
      };
    }
  | {
      type: 'geography/RECEIVE_REGION_DEFAULTS';
      payload: {
        regionId: RegionId;
        regionDefaults: EereJSON;
      };
    };

export type RegionState = Region & {
  selected: boolean;
  eereDefaults: EereJSON;
  rdf: RdfJSON;
};

export type StateState = State & {
  selected: boolean;
};

type GeographyState = {
  focus: GeographicFocus;
  regions: { [key in RegionId]: RegionState };
  states: { [key in StateId]: StateState };
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
for (const regionId in updatedRegions) {
  updatedRegions[regionId].selected = false;
  updatedRegions[regionId].eereDefaults = initialRegionEereDefaults;
  updatedRegions[regionId].rdf = initialRegionRdf;
}

// augment states data (from config) with additonal field afor each state
const updatedStates: any = { ...states };
for (const stateId in updatedStates) {
  updatedStates[stateId].selected = false;
}

// reducer
const initialState: GeographyState = {
  focus: 'regions',
  regions: updatedRegions,
  states: updatedStates,
};

export default function reducer(
  state: GeographyState = initialState,
  action: GeographyAction,
): GeographyState {
  switch (action.type) {
    case 'geography/SELECT_GEOGRAPHY': {
      const { focus } = action.payload;

      return {
        ...state,
        focus,
      };
    }

    case 'geography/SELECT_REGION': {
      const updatedState = { ...state };

      for (const key in updatedState.regions) {
        const regionId = key as RegionId;
        const regionIsSelected = action.payload.regionId === regionId;
        updatedState.regions[regionId].selected = regionIsSelected;
      }

      return updatedState;
    }

    case 'geography/SELECT_STATE': {
      const updatedState = { ...state };

      for (const key in updatedState.states) {
        const stateId = key as StateId;
        const stateIsSelected = action.payload.stateId === stateId;
        updatedState.states[stateId].selected = stateIsSelected;
      }
      return updatedState;
    }

    case 'geography/REQUEST_SELECTED_REGIONS_DATA':
    case 'geography/RECEIVE_SELECTED_REGIONS_DATA': {
      return state;
    }

    case 'geography/RECEIVE_REGION_RDF': {
      const { regionId, regionRdf } = action.payload;

      return {
        ...state,
        regions: {
          ...state.regions,
          [regionId]: {
            ...state.regions[regionId],
            rdf: regionRdf,
          },
        },
      };
    }

    case 'geography/RECEIVE_REGION_DEFAULTS': {
      const { regionId, regionDefaults } = action.payload;

      return {
        ...state,
        regions: {
          ...state.regions,
          [regionId]: {
            ...state.regions[regionId],
            eereDefaults: regionDefaults,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
export function selectGeography(focus: GeographicFocus) {
  return {
    type: 'geography/SELECT_GEOGRAPHY',
    payload: { focus },
  };
}

export function selectRegion(regionId: RegionId) {
  return {
    type: 'geography/SELECT_REGION',
    payload: { regionId },
  };
}

export function selectState(stateId: string) {
  return {
    type: 'geography/SELECT_STATE',
    payload: { stateId },
  };
}

export function fetchRegionsData(): AppThunk {
  return (dispatch, getState) => {
    const { api, geography } = getState();

    // select region(s), based on geographic focus:
    // single region if geographic focus is 'regions'
    // multiple regions if geographic focus is 'states'
    const selectedRegions: RegionState[] = [];

    let selectedRegion: RegionState | undefined;
    let selectedRegionId: RegionId | undefined;

    let selectedState: StateState | undefined;
    let selectedStateRegionIds: RegionId[] = [];

    if (geography.focus === 'regions') {
      for (const regionId in geography.regions) {
        const region = geography.regions[regionId as RegionId];
        if (region.selected) {
          selectedRegion = region;
          selectedRegionId = region.id;
          selectedRegions.push(region);
        }
      }
    }

    if (geography.focus === 'states') {
      for (const stateId in geography.states) {
        const state = geography.states[stateId as StateId];
        if (state.selected) {
          const regionIds = Object.keys(state.percentageByRegion);
          selectedState = state;
          selectedStateRegionIds = regionIds as RegionId[];
          selectedStateRegionIds.forEach((regionId) => {
            const region = geography.regions[regionId];
            selectedRegions.push(region);
          });
        }
      }
    }

    // build up requests of selected regions that haven't yet fetched their RDF
    const rdfRequests: Promise<Response>[] = [];
    const eereRequests: Promise<Response>[] = [];

    selectedRegions.forEach((region) => {
      if (region.rdf.region.region_abbv === '') {
        rdfRequests.push(fetch(`${api.baseUrl}/api/v1/rdf/${region.id}`));
        eereRequests.push(fetch(`${api.baseUrl}/api/v1/eere/${region.id}`));
      }
    });

    dispatch({ type: 'geography/REQUEST_SELECTED_REGIONS_DATA' });

    // request all rdf and eere data in parallel
    Promise.all([rdfRequests, eereRequests].map(Promise.all, Promise))
      .then(([rdfResponses, eereResponses]) => {
        const rdfsData = (rdfResponses as Response[]).map((rdfResponse) => {
          return rdfResponse.json().then((rdfJson: RdfJSON) => {
            dispatch({
              type: 'geography/RECEIVE_REGION_RDF',
              payload: {
                regionId: rdfResponse.url.split('/').pop() as RegionId,
                regionRdf: rdfJson,
              },
            });
            return rdfJson;
          });
        });

        const eeresData = (eereResponses as Response[]).map((eereResponse) => {
          return eereResponse.json().then((eereJson: EereJSON) => {
            dispatch({
              type: 'geography/RECEIVE_REGION_DEFAULTS',
              payload: {
                regionId: eereResponse.url.split('/').pop() as RegionId,
                regionDefaults: eereJson,
              },
            });
            return eereJson;
          });
        });

        return Promise.all([Promise.all(rdfsData), Promise.all(eeresData)]);
      })
      .then(([rdfs, eeres]) => {
        // region ids from the rdfs that were just fetched above
        const regionIdsFromJustFetchedRdfs = rdfs.map((rdf) => {
          return rdf.region.region_abbv;
        });

        // build up regionalDataFiles from either just fetched rdfs,
        // or previously fetched (and stored) rdfs
        let regionalDataFiles: RdfJSON[] = [];

        if (selectedRegion && selectedRegionId) {
          // when a region is selected, `rdfs` will either contain just that one
          // region's rdf, or be empty as the selected region's rdf was already
          // previously fetched
          if (regionIdsFromJustFetchedRdfs.includes(selectedRegionId)) {
            regionalDataFiles = rdfs;
          } else {
            regionalDataFiles = [selectedRegion.rdf];
          }
        }

        if (selectedState && selectedStateRegionIds) {
          selectedStateRegionIds.forEach((selectedStateRegionId) => {
            // when a state is selected, `rdfs` will contain all of the selected
            // state's regions' rdfs that haven't already been fetched, which
            // means it can be empty if they've all already been previously fetched
            if (regionIdsFromJustFetchedRdfs.includes(selectedStateRegionId)) {
              const justFetchedRegionRdf = rdfs.filter((rdf) => {
                return rdf.region.region_abbv === selectedStateRegionId;
              })[0];
              regionalDataFiles.push(justFetchedRegionRdf);
            } else {
              const prevFetchedRegionRdf =
                geography.regions[selectedStateRegionId].rdf;
              regionalDataFiles.push(prevFetchedRegionRdf);
            }
          });
        }

        dispatch({ type: 'geography/RECEIVE_SELECTED_REGIONS_DATA' });

        return rdfs;
      })
      .then((rdfs) => {
        dispatch(storeRegionTransportationData(rdfs[0].regional_load));
        dispatch(storeEERETransportationData());
      });
  };
}
