// reducers
import { AppThunk } from 'app/redux/index';
// config
import { RegionId, Region, regions, StateId, State, states } from 'app/config';

type GeographicFocus = 'regions' | 'states';

type EereLimits = {
  annualGwh: number;
  constantMwh: number;
  renewables: number;
  percent: number;
};

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

type GeographyAction =
  | {
      type: 'geography/SELECT_GEOGRAPHY';
      payload: { focus: GeographicFocus };
    }
  | {
      type: 'geography/SELECT_REGION';
      payload: { regionIds: RegionId[] };
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
    }
  | {
      type: 'geography/SET_EERE_LIMITS';
      payload: {
        geographicFocus: GeographicFocus;
        regionId: RegionId | null;
        stateId: StateId | null;
        eereLimits: EereLimits;
      };
    };

export type RegionState = Region & {
  selected: boolean;
  eereLimits: EereLimits;
  eereDefaults: EereJSON;
  rdf: RdfJSON;
};

export type StateState = State & {
  selected: boolean;
  eereLimits: EereLimits;
};

type GeographyState = {
  focus: GeographicFocus;
  regions: {
    [key in RegionId]: RegionState;
  };
  states: {
    [key in StateId]: StateState;
  };
};

const initialEereLimits = {
  annualGwh: 0,
  constantMwh: 0,
  renewables: 0,
  percent: 0,
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
  updatedRegions[regionId].eereLimits = initialEereLimits;
  updatedRegions[regionId].eereDefaults = initialRegionEereDefaults;
  updatedRegions[regionId].rdf = initialRegionRdf;
}

// augment states data (from config) with additonal field afor each state
const updatedStates: any = { ...states };
for (const stateId in updatedStates) {
  updatedStates[stateId].selected = false;
  updatedStates[stateId].eereLimits = initialEereLimits;
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
    case 'geography/SELECT_GEOGRAPHY':
      return {
        ...state,
        focus: action.payload.focus,
      };

    case 'geography/SELECT_REGION':
      const selectedRegionsState = { ...state };
      for (const key in state.regions) {
        const regionId = key as RegionId;
        const regionIsSelected = action.payload.regionIds.includes(regionId);
        selectedRegionsState.regions[regionId].selected = regionIsSelected;
      }
      return selectedRegionsState;

    case 'geography/SELECT_STATE':
      const selectedStateState = { ...state };
      for (const key in state.states) {
        const stateId = key as StateId;
        const stateIsSelected = action.payload.stateId === stateId;
        selectedStateState.states[stateId].selected = stateIsSelected;
      }
      return selectedStateState;

    case 'geography/REQUEST_SELECTED_REGIONS_DATA':
    case 'geography/RECEIVE_SELECTED_REGIONS_DATA':
      return state;

    case 'geography/RECEIVE_REGION_RDF':
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.regionId]: {
            ...state.regions[action.payload.regionId],
            rdf: action.payload.regionRdf,
          },
        },
      };

    case 'geography/RECEIVE_REGION_DEFAULTS': {
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.regionId]: {
            ...state.regions[action.payload.regionId],
            eereDefaults: action.payload.regionDefaults,
          },
        },
      };
    }

    case 'geography/SET_EERE_LIMITS': {
      if (
        action.payload.geographicFocus === 'regions' &&
        action.payload.regionId
      ) {
        return {
          ...state,
          regions: {
            ...state.regions,
            [action.payload.regionId]: {
              ...state.regions[action.payload.regionId],
              eereLimits: action.payload.eereLimits,
            },
          },
        };
      }

      if (
        action.payload.geographicFocus === 'states' &&
        action.payload.stateId
      ) {
        return {
          ...state,
          states: {
            ...state.states,
            [action.payload.stateId]: {
              ...state.states[action.payload.stateId],
              eereLimits: action.payload.eereLimits,
            },
          },
        };
      }

      return state;
    }

    default:
      return state;
  }
}

// action creators
export function selectGeography(focus: GeographicFocus) {
  return {
    type: 'geography/SELECT_GEOGRAPHY',
    payload: { focus },
  };
}

export function selectRegions(regionIds: RegionId[]) {
  return {
    type: 'geography/SELECT_REGION',
    payload: { regionIds },
  };
}

export function selectState(stateId: string) {
  return {
    type: 'geography/SELECT_STATE',
    payload: { stateId },
  };
}

function calculateEereLimits({
  geographicFocus,
  selectedState,
  rdfs,
}: {
  geographicFocus: GeographicFocus;
  selectedState: StateState | undefined;
  rdfs: RdfJSON[];
}) {
  // variables set from rdf(s), depending on the geographic focus
  let maxSolarWindMwh = 0;
  let maxEEYearlyGwh = 0;
  let maxEEPercent = 0;
  let totalHours = 0;

  // when a region is selected, only one rdf is passed
  if (geographicFocus === 'regions') {
    const { limits, regional_load } = rdfs[0];
    maxSolarWindMwh = limits.max_solar_wind_mwh;
    maxEEYearlyGwh = limits.max_ee_yearly_gwh;
    maxEEPercent = limits.max_ee_percent;
    totalHours = regional_load.length;
  }

  // when a state is selected, multiple rdfs are passed
  if (geographicFocus === 'states' && selectedState) {
    rdfs.forEach((rdf) => {
      const { limits, regional_load } = rdf;
      const regionId = rdf.region.region_abbv as RegionId;
      // use percentage of the state within each region to build up variables
      const percent = selectedState.regions[regionId] || 100;
      maxSolarWindMwh += (limits.max_solar_wind_mwh * percent) / 100;
      maxEEYearlyGwh += (limits.max_ee_yearly_gwh * percent) / 100;
      maxEEPercent += (limits.max_ee_percent * percent) / 100;
      // total hours is the same for all rdfs but its easier to just reassign it
      totalHours = regional_load.length;
    });
  }

  // calculate hourlyMwh from annualGwh (total for year)
  const hourlyMwh = (maxEEYearlyGwh * 1000) / totalHours;

  return {
    annualGwh: Math.round(maxEEYearlyGwh * 2 * 100) / 100,
    constantMwh: Math.round(hourlyMwh * 2 * 100) / 100,
    renewables: Math.round(maxSolarWindMwh * 2 * 100) / 100,
    percent: Math.round(maxEEPercent * 2 * 100) / 100,
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
          selectedState = state;
          selectedStateRegionIds = Object.keys(state.regions) as RegionId[];
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

        const eereLimits = calculateEereLimits({
          geographicFocus: geography.focus,
          selectedState,
          rdfs: regionalDataFiles,
        });

        const regionId =
          geography.focus === 'regions' && selectedRegion
            ? selectedRegion.id
            : null;

        const stateId =
          geography.focus === 'states' && selectedState
            ? selectedState.id
            : null;

        dispatch({
          type: 'geography/SET_EERE_LIMITS',
          payload: {
            geographicFocus: geography.focus,
            regionId,
            stateId,
            eereLimits,
          },
        });

        dispatch({ type: 'geography/RECEIVE_SELECTED_REGIONS_DATA' });
      });
  };
}
