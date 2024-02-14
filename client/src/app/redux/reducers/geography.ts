import { AppThunk } from 'app/redux/index';
import { setEVDeploymentLocationOptions } from 'app/redux/reducers/impacts';
import type {
  CountiesByGeography,
  RegionalScalingFactors,
} from 'app/calculations/geography';
import {
  organizeCountiesByGeography,
  calculateRegionalScalingFactors,
  getSelectedGeographyRegions,
} from 'app/calculations/geography';
import {
  setSelectedGeographyVMTData,
  setEVEfficiency,
  setDailyAndMonthlyStats,
  setSelectedRegionsEEREDefaultsAverages,
} from 'app/redux/reducers/transportation';
import {
  RdfDataKey,
  RegionId,
  Region,
  regions,
  StateId,
  State,
  states,
} from 'app/config';

export type GeographicFocus = 'regions' | 'states';

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

export type RDFJSON = {
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

export type EEREDefaultsData = {
  date: string;
  hour: number;
  onshore_wind: number;
  offshore_wind: number | null;
  utility_pv: number;
  rooftop_pv: number;
};

type EEREDefaultsJSON = {
  region: string;
  data: EEREDefaultsData[];
};

type StorageDefaultsData = {
  date: string;
  hour: number;
  battery: number;
};

type StorageDefaultsJSON = {
  region: string;
  data: StorageDefaultsData[];
};

type GeographyAction =
  | {
      type: 'geography/SET_COUNTIES_BY_GEOGRAPHY';
      payload: { countiesByGeography: CountiesByGeography };
    }
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
  | {
      type: 'geography/SET_REGION_SELECT_STATE_ID_AND_REGION_IDS';
      payload: {
        stateId: StateId | '';
        stateRegionIds: RegionId[];
      };
    }
  | {
      type: 'geography/SET_REGION_SELECT_COUNTY';
      payload: { county: string };
    }
  | {
      type: 'geography/SET_REGIONAL_SCALING_FACTORS';
      payload: {
        regionalScalingFactors: RegionalScalingFactors;
      };
    }
  | {
      type: 'geography/SET_REGIONAL_LINE_LOSS';
      payload: { regionalLineLoss: number };
    }
  | { type: 'geography/REQUEST_SELECTED_REGIONS_DATA' }
  | { type: 'geography/RECEIVE_SELECTED_REGIONS_DATA' }
  | {
      type: 'geography/RECEIVE_REGION_RDF';
      payload: {
        regionId: RegionId;
        regionRdf: RDFJSON;
      };
    }
  | {
      type: 'geography/RECEIVE_REGION_EERE_DEFAULTS';
      payload: {
        regionId: RegionId;
        regionEereDefaults: EEREDefaultsJSON;
      };
    }
  | {
      type: 'geography/RECEIVE_REGION_STORAGE_DEFAULTS';
      payload: {
        regionId: RegionId;
        regionStorageDefaults: StorageDefaultsJSON;
      };
    };

export type RegionState = Region & {
  selected: boolean;
  rdf: RDFJSON;
  eereDefaults: EEREDefaultsJSON;
  storageDefaults: StorageDefaultsJSON;
};

export type StateState = State & {
  selected: boolean;
};

type GeographyState = {
  focus: GeographicFocus;
  regions: { [key in RegionId]: RegionState };
  states: { [key in StateId]: StateState };
  countiesByGeography: CountiesByGeography | {};
  regionSelect: {
    stateId: StateId | '';
    stateRegionIds: RegionId[];
    county: string;
  };
  regionalScalingFactors: RegionalScalingFactors;
  regionalLineLoss: number;
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

const initialRegionEereDefaults = {
  region: '',
  data: [],
};

const initialRegionStorageDefaults = {
  region: '',
  data: [],
};

// augment regions data (from config) with additonal fields for each region
const updatedRegions: any = { ...regions };
for (const regionId in updatedRegions) {
  updatedRegions[regionId].selected = false;
  updatedRegions[regionId].rdf = initialRegionRdf;
  updatedRegions[regionId].eereDefaults = initialRegionEereDefaults;
  updatedRegions[regionId].storageDefaults = initialRegionStorageDefaults;
}

// augment states data (from config) with additonal fields for each state
const updatedStates: any = { ...states };
for (const stateId in updatedStates) {
  updatedStates[stateId].selected = false;
}

// reducer
const initialState: GeographyState = {
  focus: 'regions',
  regions: updatedRegions,
  states: updatedStates,
  countiesByGeography: {},
  regionSelect: {
    stateId: '',
    stateRegionIds: [],
    county: '',
  },
  regionalScalingFactors: {},
  regionalLineLoss: 0,
};

export default function reducer(
  state: GeographyState = initialState,
  action: GeographyAction,
): GeographyState {
  switch (action.type) {
    case 'geography/SET_COUNTIES_BY_GEOGRAPHY': {
      const { countiesByGeography } = action.payload;

      return {
        ...state,
        countiesByGeography,
      };
    }

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

    case 'geography/SET_REGION_SELECT_STATE_ID_AND_REGION_IDS': {
      const { stateId, stateRegionIds } = action.payload;

      return {
        ...state,
        regionSelect: {
          ...state.regionSelect,
          stateId,
          stateRegionIds,
        },
      };
    }

    case 'geography/SET_REGION_SELECT_COUNTY': {
      const { county } = action.payload;

      return {
        ...state,
        regionSelect: {
          ...state.regionSelect,
          county,
        },
      };
    }

    case 'geography/SET_REGIONAL_SCALING_FACTORS': {
      const { regionalScalingFactors } = action.payload;

      return {
        ...state,
        regionalScalingFactors,
      };
    }

    case 'geography/SET_REGIONAL_LINE_LOSS': {
      const { regionalLineLoss } = action.payload;

      return {
        ...state,
        regionalLineLoss,
      };
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

    case 'geography/RECEIVE_REGION_EERE_DEFAULTS': {
      const { regionId, regionEereDefaults } = action.payload;

      return {
        ...state,
        regions: {
          ...state.regions,
          [regionId]: {
            ...state.regions[regionId],
            eereDefaults: regionEereDefaults,
          },
        },
      };
    }

    case 'geography/RECEIVE_REGION_STORAGE_DEFAULTS': {
      const { regionId, regionStorageDefaults } = action.payload;

      return {
        ...state,
        regions: {
          ...state.regions,
          [regionId]: {
            ...state.regions[regionId],
            storageDefaults: regionStorageDefaults,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Called when the app starts.
 */
export function setCountiesByRegion(): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { regions } = geography;
    const countiesByGeography = organizeCountiesByGeography({ regions });

    dispatch({
      type: 'geography/SET_COUNTIES_BY_GEOGRAPHY',
      payload: { countiesByGeography },
    });
  };
}

/**
 * Called every time the "Select Region" or "Select State" tabs are clicked on
 * the "Select Geography" page
 */
export function selectGeography(focus: GeographicFocus): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'geography/SELECT_GEOGRAPHY',
      payload: { focus },
    });

    dispatch(setRegionalScalingFactorsAndLineLoss());
    dispatch(setEVDeploymentLocationOptions());
    dispatch(setSelectedGeographyVMTData());
    dispatch(setEVEfficiency());
  };
}

/**
 * Called every time a region is clicked on the map or selected from the regions
 * dropdown list in the "Select Region" tab on the "Select Geography" page.
 */
export function selectRegion(regionId: RegionId): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'geography/SELECT_REGION',
      payload: { regionId },
    });

    dispatch(setRegionalScalingFactorsAndLineLoss());
    dispatch(setEVDeploymentLocationOptions());
    dispatch(setSelectedGeographyVMTData());
    dispatch(setEVEfficiency());
  };
}

/**
 * Called every time a state is clicked on the map or selected from the states
 * dropdown list in the "Select State" tab of the "Select Geography" page.
 */
export function selectState(stateId: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'geography/SELECT_STATE',
      payload: { stateId },
    });

    dispatch(setRegionalScalingFactorsAndLineLoss());
    dispatch(setEVDeploymentLocationOptions());
    dispatch(setSelectedGeographyVMTData());
    dispatch(setEVEfficiency());
  };
}

/**
 * Called every time a region is clicked on the map or a state is selected from
 * the states dropdown list in the "Select Region" tab of the "Select Geography"
 * page.
 */
export function setRegionSelectStateIdAndRegionIds(
  stateId: StateId | '',
): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { countiesByGeography } = geography;

    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (countiesByGeographyData) {
      const { regions } = countiesByGeographyData;

      const stateRegionIds = Object.entries(regions).reduce(
        (array, [key, value]) => {
          const regionId = key as keyof typeof regions;
          if (Object.keys(value).includes(stateId)) array.push(regionId);
          return array;
        },
        [] as RegionId[],
      );

      dispatch({
        type: 'geography/SET_REGION_SELECT_STATE_ID_AND_REGION_IDS',
        payload: {
          stateId,
          stateRegionIds,
        },
      });
    }
  };
}

/**
 * Called every time a region is clicked on the map or a county is selected from
 * the counties dropdown list in the "Select Region" tab of the "Select
 * Geography" page.
 */
export function setRegionSelectCounty(county: string): GeographyAction {
  return {
    type: 'geography/SET_REGION_SELECT_COUNTY',
    payload: { county },
  };
}

/**
 * Called every time this `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions are called.
 *
 * _(e.g. anytime the selected geography changes)_
 */
function setRegionalScalingFactorsAndLineLoss(): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { focus, regions, states } = geography;

    const regionalScalingFactors = calculateRegionalScalingFactors({
      geographicFocus: focus,
      selectedRegion: Object.values(regions).find((r) => r.selected),
      selectedState: Object.values(states).find((s) => s.selected),
    });

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedGeographyRegions = getSelectedGeographyRegions({
      regions,
      selectedGeographyRegionIds,
    });

    /**
     * Build up line loss from the selected geography's regions using the
     * regional scaling factors.
     *
     * NOTE: this is to support selected states – if a region is selected, the
     * result will be the same as the region's line loss value
     */
    const regionalLineLoss = Object.entries(selectedGeographyRegions).reduce(
      (result, [id, regionData]) => {
        const regionalScalingFactor = regionalScalingFactors[id as RegionId];
        if (regionalScalingFactor) {
          result += regionData.lineLoss * regionalScalingFactor;
        }
        return result;
      },
      0,
    );

    dispatch({
      type: 'geography/SET_REGIONAL_SCALING_FACTORS',
      payload: { regionalScalingFactors },
    });

    dispatch({
      type: 'geography/SET_REGIONAL_LINE_LOSS',
      payload: { regionalLineLoss },
    });
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

    // build up requests of selected regions that haven't yet fetched their data
    const rdfRequests: Promise<Response>[] = [];
    const eereRequests: Promise<Response>[] = [];
    const storageRequests: Promise<Response>[] = [];

    selectedRegions.forEach((region) => {
      if (region.rdf.region.region_abbv === '') {
        rdfRequests.push(fetch(`${api.baseUrl}/api/v1/rdf/${region.id}`));
        eereRequests.push(fetch(`${api.baseUrl}/api/v1/eere/${region.id}`));
        storageRequests.push(fetch(`${api.baseUrl}/api/v1/storage/${region.id}`)); // prettier-ignore
      }
    });

    dispatch({ type: 'geography/REQUEST_SELECTED_REGIONS_DATA' });

    // request all rdf, eere, and storage data in parallel
    Promise.all(
      [rdfRequests, eereRequests, storageRequests].map(Promise.all, Promise),
    )
      .then(([rdfResponses, eereResponses, storageResponses]) => {
        const rdfsData = (rdfResponses as Response[]).map((rdfResponse) => {
          return rdfResponse.json().then((rdfJson: RDFJSON) => {
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
          return eereResponse
            .json()
            .then((eereDefaultsJson: EEREDefaultsJSON) => {
              dispatch({
                type: 'geography/RECEIVE_REGION_EERE_DEFAULTS',
                payload: {
                  regionId: eereResponse.url.split('/').pop() as RegionId,
                  regionEereDefaults: eereDefaultsJson,
                },
              });
              return eereDefaultsJson;
            });
        });

        const storagesData = (storageResponses as Response[]).map(
          (storageResponse) => {
            return storageResponse
              .json()
              .then((storageDefaultsJson: StorageDefaultsJSON) => {
                dispatch({
                  type: 'geography/RECEIVE_REGION_STORAGE_DEFAULTS',
                  payload: {
                    regionId: storageResponse.url.split('/').pop() as RegionId,
                    regionStorageDefaults: storageDefaultsJson,
                  },
                });
                return storageDefaultsJson;
              });
          },
        );

        return Promise.all([
          Promise.all(rdfsData),
          Promise.all(eeresData),
          Promise.all(storagesData),
        ]);
      })
      .then(([rdfs, _eeres, _storages]) => {
        // region ids from the rdfs that were just fetched above
        const regionIdsFromJustFetchedRdfs = rdfs.map((rdf) => {
          return rdf.region.region_abbv;
        });

        // build up regionalDataFiles from either just fetched rdfs,
        // or previously fetched (and stored) rdfs
        let regionalDataFiles: RDFJSON[] = [];

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
      })
      .then(() => {
        dispatch(setDailyAndMonthlyStats());
        dispatch(setSelectedRegionsEEREDefaultsAverages());
      });
  };
}
