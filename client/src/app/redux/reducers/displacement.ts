import { AppThunk } from 'app/redux/index';
import type { EGUData, RegionState } from 'app/redux/reducers/geography';
import type { Unit } from 'app/redux/reducers/monthlyEmissions';
import {
  RdfDataKey,
  Pollutant,
  RegionId,
  StateId,
  states,
  regions,
} from 'app/config';

/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFips from 'app/data/county-fips.json';

type PollutantName = 'generation' | Pollutant;

type AnnualPollutantName = 'ozoneGeneration' | 'ozoneNox' | PollutantName;

export type ReplacementPollutantName = 'generation' | 'so2' | 'nox' | 'co2';

type ReplacementEGUsByPollutant = {
  [key in ReplacementPollutantName]: (EGUData & { regionId: RegionId })[];
};

export type MonthlyDisplacement = {
  [month: number]: {
    original: number;
    postEere: number;
  };
};

type PollutantDisplacement = {
  regionId: RegionId;
  originalTotal: number;
  postEereTotal: number;
  regionalData: MonthlyDisplacement;
  stateData: {
    [stateId: string]: MonthlyDisplacement;
  };
  countyData: {
    [stateId: string]: {
      [countyName: string]: MonthlyDisplacement;
    };
  };
};

type PollutantsDisplacements = Partial<{
  [key in PollutantName]: PollutantDisplacement;
}>;

type RegionalDisplacement = {
  [key in PollutantName]: PollutantDisplacement;
};

type RegionalDisplacements = Partial<{
  [key in RegionId]: RegionalDisplacement;
}>;

type StatesAndCounties = Partial<{ [key in StateId]: string[] }>;

export type StateChange = {
  id: StateId;
  name: string;
  generation: number;
  so2: number;
  nox: number;
  co2: number;
  pm25: number;
  vocs: number;
  nh3: number;
};

type RegionsDisplacementsByPollutant = {
  [key in Pollutant]: Partial<{ [key in RegionId]: MonthlyDisplacement }>;
};

type StatesDisplacementsByPollutant = {
  [key in Pollutant]: Partial<{ [key in StateId]: MonthlyDisplacement }>;
};

type CountiesDisplacementsByPollutant = {
  [key in Pollutant]: Partial<{
    [key in StateId]: { [countyName: string]: MonthlyDisplacement };
  }>;
};

type CountyDataRow = ReturnType<typeof formatCountyDataRow>;

type CobraDataRow = {
  FIPS: string;
  STATE: string;
  COUNTY: string;
  TIER1NAME: string;
  NOx_REDUCTIONS_TONS: number;
  SO2_REDUCTIONS_TONS: number;
  PM25_REDUCTIONS_TONS: number;
  VOCS_REDUCTIONS_TONS: number;
  NH3_REDUCTIONS_TONS: number;
};

type DisplacementAction =
  | { type: 'displacement/RESET_DISPLACEMENT' }
  | { type: 'displacement/INCREMENT_PROGRESS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | { type: 'displacement/COMPLETE_DISPLACEMENT' }
  | { type: 'displacement/REQUEST_DISPLACEMENT_DATA' }
  | {
      type: 'displacement/RECEIVE_DISPLACEMENT_DATA';
      payload: { data: PollutantsDisplacements };
    }
  | {
      type: 'displacement/ADD_STATE_CHANGES';
      payload: {
        stateId: StateId;
        pollutantName: PollutantName;
        pollutantValue: number;
      };
    }
  | {
      type: 'displacement/STORE_STATES_AND_COUNTIES';
      payload: { statesAndCounties: StatesAndCounties };
    }
  | {
      type: 'displacement/STORE_ANNUAL_REGIONAL_DISPLACEMENTS';
      payload: {
        annualRegionalDisplacements: {
          [key in AnnualPollutantName]: {
            original: number;
            postEere: number;
            impacts: number;
            replacedOriginal: number;
            replacedPostEere: number;
          };
        };
        egusNeedingReplacement: ReplacementEGUsByPollutant;
      };
    }
  | {
      type: 'displacement/STORE_MONTHLY_EMISSION_CHANGES';
      payload: {
        regions: RegionsDisplacementsByPollutant;
        states: StatesDisplacementsByPollutant;
        counties: CountiesDisplacementsByPollutant;
      };
    }
  | {
      type: 'displacement/STORE_DOWNLOADABLE_DATA';
      payload: {
        countyData: CountyDataRow[];
        cobraData: CobraDataRow[];
      };
    };

type DisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  regionalDisplacements: RegionalDisplacements;
  statesAndCounties: StatesAndCounties;
  annualRegionalDisplacements: {
    [key in AnnualPollutantName]: {
      original: number;
      postEere: number;
      impacts: number;
      replacedOriginal: number;
      replacedPostEere: number;
    };
  };
  egusNeedingReplacement: ReplacementEGUsByPollutant;
  annualStateEmissionChanges: Partial<{ [key in StateId]: StateChange }>;
  monthlyEmissionChanges: {
    regions: RegionsDisplacementsByPollutant;
    states: StatesDisplacementsByPollutant;
    counties: CountiesDisplacementsByPollutant;
  };
  downloadableCountyData: CountyDataRow[];
  downloadableCobraData: CobraDataRow[];
};

const initialPollutantDisplacement = {
  original: 0,
  postEere: 0,
  impacts: 0,
  replacedOriginal: 0,
  replacedPostEere: 0,
};

const initialDisplacementByPollutant = {
  so2: {},
  nox: {},
  co2: {},
  pm25: {},
  vocs: {},
  nh3: {},
};

// reducer
const initialState: DisplacementState = {
  status: 'ready',
  regionalDisplacements: {},
  statesAndCounties: {},
  annualRegionalDisplacements: {
    generation: initialPollutantDisplacement,
    ozoneGeneration: initialPollutantDisplacement,
    so2: initialPollutantDisplacement,
    nox: initialPollutantDisplacement,
    ozoneNox: initialPollutantDisplacement,
    co2: initialPollutantDisplacement,
    pm25: initialPollutantDisplacement,
    vocs: initialPollutantDisplacement,
    nh3: initialPollutantDisplacement,
  },
  egusNeedingReplacement: {
    generation: [],
    so2: [],
    nox: [],
    co2: [],
  },
  annualStateEmissionChanges: {},
  monthlyEmissionChanges: {
    regions: initialDisplacementByPollutant,
    states: initialDisplacementByPollutant,
    counties: initialDisplacementByPollutant,
  },
  downloadableCountyData: [],
  downloadableCobraData: [],
};

export default function reducer(
  state: DisplacementState = initialState,
  action: DisplacementAction,
): DisplacementState {
  switch (action.type) {
    case 'displacement/RESET_DISPLACEMENT': {
      // initial state
      return {
        status: 'ready',
        regionalDisplacements: {},
        statesAndCounties: {},
        annualRegionalDisplacements: {
          generation: initialPollutantDisplacement,
          ozoneGeneration: initialPollutantDisplacement,
          so2: initialPollutantDisplacement,
          nox: initialPollutantDisplacement,
          ozoneNox: initialPollutantDisplacement,
          co2: initialPollutantDisplacement,
          pm25: initialPollutantDisplacement,
          vocs: initialPollutantDisplacement,
          nh3: initialPollutantDisplacement,
        },
        egusNeedingReplacement: {
          generation: [],
          so2: [],
          nox: [],
          co2: [],
        },
        annualStateEmissionChanges: {},
        monthlyEmissionChanges: {
          regions: initialDisplacementByPollutant,
          states: initialDisplacementByPollutant,
          counties: initialDisplacementByPollutant,
        },
        downloadableCountyData: [],
        downloadableCobraData: [],
      };
    }

    case 'displacement/INCREMENT_PROGRESS': {
      return state;
    }

    case 'displacement/START_DISPLACEMENT': {
      return {
        ...state,
        status: 'started',
      };
    }

    case 'displacement/COMPLETE_DISPLACEMENT': {
      return {
        ...state,
        status: 'complete',
      };
    }

    case 'displacement/REQUEST_DISPLACEMENT_DATA': {
      return state;
    }

    case 'displacement/RECEIVE_DISPLACEMENT_DATA': {
      const { data } = action.payload;

      // each data object could contain multiple pollutants as keys:
      // - if `fetchDisplacementData('generation')` is called, there will
      //   only be one key for 'generation' (same for 'so2', 'nox', and 'co2').
      // - if `fetchDisplacementData('nei')` is called, there will be a key
      //   for 'pm25', 'vocs', and 'nh3'
      let updatedState = { ...state };
      for (const item in data) {
        const pollutant = item as PollutantName;
        const pollutantDisplacement = data[pollutant];
        if (pollutantDisplacement) {
          const { regionId } = pollutantDisplacement;
          updatedState = {
            ...updatedState,
            regionalDisplacements: {
              ...updatedState.regionalDisplacements,
              [regionId]: {
                ...updatedState.regionalDisplacements[regionId],
                [pollutant]: {
                  ...pollutantDisplacement,
                },
              },
            },
          };
        }
      }

      return updatedState;
    }

    case 'displacement/ADD_STATE_CHANGES': {
      const updatedState = { ...state };
      const { stateId, pollutantName, pollutantValue } = action.payload;

      // if state hasn't already been added to annualStateEmissionChanges,
      // add it with initial zero values for each pollutant
      if (!updatedState.annualStateEmissionChanges[stateId]) {
        updatedState.annualStateEmissionChanges[stateId] = {
          id: stateId,
          name: states[stateId].name,
          generation: 0,
          so2: 0,
          nox: 0,
          co2: 0,
          pm25: 0,
          vocs: 0,
          nh3: 0,
        };
      }

      // add dispatched pollutant value to previous pollutant value
      const previousPollutantValue =
        updatedState.annualStateEmissionChanges[stateId]?.[pollutantName] || 0;

      return {
        ...updatedState,
        annualStateEmissionChanges: {
          ...updatedState.annualStateEmissionChanges,
          [stateId]: {
            ...updatedState.annualStateEmissionChanges[stateId],
            [pollutantName]: previousPollutantValue + pollutantValue,
          },
        },
      };
    }

    case 'displacement/STORE_STATES_AND_COUNTIES': {
      const { statesAndCounties } = action.payload;

      return {
        ...state,
        statesAndCounties,
      };
    }

    case 'displacement/STORE_ANNUAL_REGIONAL_DISPLACEMENTS': {
      const { annualRegionalDisplacements, egusNeedingReplacement } =
        action.payload;

      return {
        ...state,
        annualRegionalDisplacements,
        egusNeedingReplacement,
      };
    }

    case 'displacement/STORE_MONTHLY_EMISSION_CHANGES': {
      const { regions, states, counties } = action.payload;

      return {
        ...state,
        monthlyEmissionChanges: {
          regions,
          states,
          counties,
        },
      };
    }

    case 'displacement/STORE_DOWNLOADABLE_DATA': {
      const { countyData, cobraData } = action.payload;

      return {
        ...state,
        downloadableCountyData: countyData,
        downloadableCobraData: cobraData,
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
export function incrementProgress(): DisplacementAction {
  return { type: 'displacement/INCREMENT_PROGRESS' };
}

function fetchDisplacementData(
  metric: 'generation' | 'so2' | 'nox' | 'co2' | 'nei',
): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_DISPLACEMENT_DATA' });

    // build up displacement requests for selected regions
    const displacementRequests: Promise<Response>[] = [];

    for (const regionId in eere.regionalProfiles) {
      const regionalProfile = eere.regionalProfiles[regionId as RegionId];

      displacementRequests.push(
        fetch(`${api.baseUrl}/api/v1/displacement/${metric}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            region: regionId,
            eereLoad: regionalProfile?.hourlyEere,
          }),
        }),
      );
    }

    // request all displacement data for selected regions in parallel
    Promise.all(displacementRequests)
      .then((responses) => {
        const displacementData = responses.map((response) => {
          return response.json().then((data: PollutantsDisplacements) => {
            dispatch({
              type: 'displacement/RECEIVE_DISPLACEMENT_DATA',
              payload: { data },
            });
            return data;
          });
        });

        return Promise.all(displacementData);
      })
      .then((regionalDisplacements) => {
        dispatch(incrementProgress());

        // build up changes by state for each region (the payload is additive
        // within the reducer, as a state can exist within multiple regions)
        regionalDisplacements.forEach((displacement) => {
          // each displacement object could contain multiple pollutants as keys:
          // - if `fetchDisplacementData('generation')` is called, there will
          //   only be one key for 'generation' (same for 'so2', 'nox', and 'co2').
          // - if `fetchDisplacementData('nei')` is called, there will be a key
          //   for 'pm25', 'vocs', and 'nh3'
          for (const item in displacement) {
            const pollutant = item as PollutantName;
            const pollutantDisplacement = displacement[pollutant];
            if (pollutantDisplacement) {
              for (const key in pollutantDisplacement.stateData) {
                const stateId = key as StateId;
                const stateData = pollutantDisplacement.stateData[stateId];

                // total each month's state emissions change for the given state
                let stateEmissionsChange = 0;
                for (const stateDataKey in stateData) {
                  const month = Number(stateDataKey);
                  const { original, postEere } = stateData[month];
                  stateEmissionsChange += postEere - original;
                }

                dispatch({
                  type: 'displacement/ADD_STATE_CHANGES',
                  payload: {
                    stateId,
                    pollutantName: pollutant,
                    pollutantValue: stateEmissionsChange,
                  },
                });
              }
            }
          }
        });
      });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();
    const { regionalProfiles } = eere;

    // build up displacement requests for selected regions
    const requests: Promise<Response>[] = [];

    for (const regionId in regionalProfiles) {
      const hourlyEere = regionalProfiles[regionId as RegionId]?.hourlyEere;

      if (hourlyEere) {
        requests.push(
          fetch(`${api.baseUrl}/api/v1/displacement`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regionId, hourlyEere }),
          }),
        );
      }
    }

    // request all displacement data for selected regions in parallel
    Promise.all(requests)
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((regionsData) => {
        // flatten array of regionData objects into a single object
        const data = regionsData.reduce((result, regionData) => {
          return { ...result, ...regionData };
        }, {});

        // TODO
        console.log(data);
      });

    dispatch({ type: 'displacement/START_DISPLACEMENT' });
    // whenever we call `incrementProgress()` the progress bar in
    // `components/Panels.tsx` is incremented. we'll initially increment it
    // before fetching any displacement data to give the user a visual que
    // something is happening, and then increment it after each set of
    // displacement data is returned inside the `fetchDisplacementData()`
    // function.
    dispatch(incrementProgress());
    // NOTE: if in the futre we ever fetch data for more metrics than the
    // 5 below (generation, so2, nox, co2, nei – which is used to calculate
    // PM2.5, VOCs, and NH3), the value of the `loadingSteps` state stored
    // in `redux/reducers/panel.ts` will need to be updated to be the total
    // number of metric displacement fetches + 1
    dispatch(fetchDisplacementData('generation'));
    dispatch(fetchDisplacementData('so2'));
    dispatch(fetchDisplacementData('nox'));
    dispatch(fetchDisplacementData('co2'));
    dispatch(fetchDisplacementData('nei'));

    dispatch(receiveDisplacement());
  };
}

function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { panel, geography, displacement } = getState();

    const { regionalDisplacements } = displacement;

    // recursively call function if data is still fetching
    if (panel.loadingProgress !== panel.loadingSteps) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1_000);
    }

    const statesAndCounties = setStatesAndCounties(regionalDisplacements);

    dispatch({
      type: 'displacement/STORE_STATES_AND_COUNTIES',
      payload: { statesAndCounties },
    });

    const { annualRegionalDisplacements, egusNeedingReplacement } =
      setAnnualRegionalDisplacements(regionalDisplacements, geography.regions);

    dispatch({
      type: 'displacement/STORE_ANNUAL_REGIONAL_DISPLACEMENTS',
      payload: { annualRegionalDisplacements, egusNeedingReplacement },
    });

    const { regionsDisplacements, statesDisplacements, countiesDisplacements } =
      setMonthlyEmissionChanges(regionalDisplacements);

    dispatch({
      type: 'displacement/STORE_MONTHLY_EMISSION_CHANGES',
      payload: {
        regions: regionsDisplacements,
        states: statesDisplacements,
        counties: countiesDisplacements,
      },
    });

    const { countyData, cobraData } = setDownloadableData({
      egusNeedingReplacement,
      regionsDisplacements,
      statesDisplacements,
      countiesDisplacements,
    });

    dispatch({
      type: 'displacement/STORE_DOWNLOADABLE_DATA',
      payload: {
        countyData,
        cobraData,
      },
    });

    dispatch({ type: 'displacement/COMPLETE_DISPLACEMENT' });
  };
}

export function resetDisplacement(): DisplacementAction {
  return { type: 'displacement/RESET_DISPLACEMENT' };
}

export function calculateMonthlyData(data: MonthlyDisplacement, unit: Unit) {
  const monthlyEmissionsChanges: number[] = [];
  const monthlyPercentageChanges: number[] = [];

  for (const dataKey in data) {
    const month = Number(dataKey);
    const { original, postEere } = data[month];
    const emissionsChange = postEere - original;
    const percentChange = (emissionsChange / original) * 100 || 0;
    monthlyEmissionsChanges.push(emissionsChange);
    monthlyPercentageChanges.push(percentChange);
  }

  return unit === 'emissions'
    ? monthlyEmissionsChanges
    : monthlyPercentageChanges;
}

function setStatesAndCounties(regionalDisplacements: RegionalDisplacements) {
  // build up states and counties from each region's county data
  const statesAndCounties: StatesAndCounties = {};

  for (const regionId in regionalDisplacements) {
    const displacement = regionalDisplacements[regionId as RegionId];

    if (displacement) {
      // states and counties are the same for all pollutants, so we'll
      // just use generation (it really doesn't matter which we use)
      const { countyData } = displacement.generation;

      for (const key in countyData) {
        const stateId = key as StateId;
        const stateCountyNames = Object.keys(countyData[stateId]).sort();
        // initialize counties array for state, if state doesn't already exist
        // in `statesAndCounties` and add state county names to array
        // (we initialize and push counties instead of directly assigning
        // counties to a state because states exist within multiple regions,
        // but counties only exist within a single region, so different
        // regions share states but have different counties)
        if (!statesAndCounties[stateId]) {
          statesAndCounties[stateId] = [];
        }
        statesAndCounties[stateId]?.push(...stateCountyNames);
      }
    }
  }

  // sort county names within each state
  for (const key in statesAndCounties) {
    const stateId = key as StateId;
    statesAndCounties[stateId] = statesAndCounties[stateId]?.sort();
  }

  return statesAndCounties;
}

function setAnnualRegionalDisplacements(
  regionalDisplacements: RegionalDisplacements,
  regions: { [key in RegionId]: RegionState },
) {
  const data = {
    generation: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    ozoneGeneration: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    so2: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    nox: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    ozoneNox: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    co2: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    pm25: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    vocs: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
    nh3: {
      original: 0,
      postEere: 0,
      impacts: 0,
      replacedOriginal: 0,
      replacedPostEere: 0,
    },
  };

  // emissions "replacement" is needed for a pollutant if a region has at least
  // one EGU that has the `infreq_emissions_flag` property set to 1 in the for
  // the given pollutant. usually emissions "replacement" isn't needed, so we'll
  // initially set each pollutant's replacement needed flag to false, and will
  // conditionally reset its value to true as needed. if "replacement" is needed
  // for a pollutant, we'll set `replacedOriginal` and `replacedPostEere` values
  // for each pollutant as well.
  const replacementPotentiallyNeeded = ['generation', 'so2', 'nox', 'co2'];

  const egusNeedingReplacement: ReplacementEGUsByPollutant = {
    generation: [],
    so2: [],
    nox: [],
    co2: [],
  };

  for (const item in data) {
    const pollutant = item as PollutantName;

    for (const key in regionalDisplacements) {
      const regionId = key as RegionId;
      const displacement = regionalDisplacements[regionId];
      if (!displacement) break;

      // ozone season generation and ozone season nox are not calculated in the
      // server app's getDisplacement() method, so they're derived by totaling
      // each region's regional generation and nox data from the months of May
      // through September
      if (item === 'ozoneGeneration' || item === 'ozoneNox') {
        const ozoneMonths = [5, 6, 7, 8, 9];

        if (item === 'ozoneGeneration') {
          ozoneMonths.forEach((month) => {
            data.ozoneGeneration.original += displacement.generation.regionalData[month].original; // prettier-ignore
            data.ozoneGeneration.postEere += displacement.generation.regionalData[month].postEere; // prettier-ignore
          });
        }

        if (item === 'ozoneNox') {
          ozoneMonths.forEach((month) => {
            data.ozoneNox.original += displacement.nox.regionalData[month].original; // prettier-ignore
            data.ozoneNox.postEere += displacement.nox.regionalData[month].postEere; // prettier-ignore
          });
        }
      }
      // data for all other pollutants is already calculated for each region in
      // the server app's getDisplacement() method (stored as `originalTotal`
      // and `postEereTotal`), so it just needs to be totaled for each region
      else {
        // sum each pollutant's original and postEere values for each region
        data[pollutant].original += displacement[pollutant].originalTotal;
        data[pollutant].postEere += displacement[pollutant].postEereTotal;

        // add any regional egus needing replacement
        if (replacementPotentiallyNeeded.includes(pollutant)) {
          const rdfPollutantData =
            regions[regionId].rdf.data[pollutant as RdfDataKey];

          const regionalEGUsNeedingReplacement = rdfPollutantData
            .filter((egu) => egu.infreq_emissions_flag === 1)
            .map((egu) => ({ ...egu, regionId }));

          egusNeedingReplacement[pollutant as ReplacementPollutantName].push(
            ...regionalEGUsNeedingReplacement,
          );
        }
      }
    }
  }

  // looping through the pollutants a second time is necessary,
  // as all the data above needed to be set first
  for (const item in data) {
    const pollutant = item as PollutantName;

    // set each pollutant's impacts as the difference between the cumulative
    // original and postEere values
    data[pollutant].impacts =
      data[pollutant].postEere - data[pollutant].original;

    // if replacement is needed, set each pollutant's replacedOriginal and
    // replacedPostEere values
    if (
      pollutant in egusNeedingReplacement &&
      egusNeedingReplacement[pollutant as ReplacementPollutantName].length > 0
    ) {
      // we need to loop over each region again to determine which number to use
      // in incrementing the replacedOriginal value
      for (const key in regionalDisplacements) {
        const regionId = key as RegionId;
        const displacement = regionalDisplacements[regionId];

        const rdfPollutantData =
          regions[regionId].rdf.data[pollutant as RdfDataKey];

        const regionalPollutantReplacementNeeded = rdfPollutantData.some(
          (egu) => egu.infreq_emissions_flag === 1,
        );

        // if replacement is needed for the region and pollutant, use the
        // replacement value from the config file, else use the regions' total
        // (as was use in incrementing the pollutant's original value)
        const value = regionalPollutantReplacementNeeded
          ? regions[regionId].actualEmissions[pollutant as RdfDataKey]
          : displacement?.[pollutant].originalTotal;

        // increment replacedOriginal for the region by the above set value
        data[pollutant].replacedOriginal += value || 0;
      }

      // finally, set the pollutant's replacedPostEere by adding up the
      // cumulative replacedOriginal value and the calculated impacts
      // (impacts will be negative)
      data[pollutant].replacedPostEere =
        data[pollutant].replacedOriginal + data[pollutant].impacts;
    }
  }

  return {
    annualRegionalDisplacements: data,
    egusNeedingReplacement,
  };
}

function setMonthlyEmissionChanges(
  regionalDisplacements: RegionalDisplacements,
) {
  // organize monthly displacements for regions, states, and counties
  const regionsDisplacements: RegionsDisplacementsByPollutant = {
    so2: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
    nox: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
    co2: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
    pm25: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
    vocs: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
    nh3: {
      ['ALL' as RegionId]: {
        1: { original: 0, postEere: 0 },
        2: { original: 0, postEere: 0 },
        3: { original: 0, postEere: 0 },
        4: { original: 0, postEere: 0 },
        5: { original: 0, postEere: 0 },
        6: { original: 0, postEere: 0 },
        7: { original: 0, postEere: 0 },
        8: { original: 0, postEere: 0 },
        9: { original: 0, postEere: 0 },
        10: { original: 0, postEere: 0 },
        11: { original: 0, postEere: 0 },
        12: { original: 0, postEere: 0 },
      },
    },
  };

  const statesDisplacements: StatesDisplacementsByPollutant = {
    so2: {},
    nox: {},
    co2: {},
    pm25: {},
    vocs: {},
    nh3: {},
  };

  const countiesDisplacements: CountiesDisplacementsByPollutant = {
    so2: {},
    nox: {},
    co2: {},
    pm25: {},
    vocs: {},
    nh3: {},
  };

  for (const regionId in regionalDisplacements) {
    const displacement = regionalDisplacements[regionId as RegionId];

    if (displacement) {
      // build up regional, states, and counties data for each pollutant
      for (const item of ['so2', 'nox', 'co2', 'pm25', 'vocs', 'nh3']) {
        const pollutant = item as Pollutant;

        const { regionalData, stateData, countyData } = displacement[pollutant];

        // add regional data for the pollutant
        regionsDisplacements[pollutant] = {
          ...regionsDisplacements[pollutant],
          [regionId as RegionId]: regionalData,
        };

        // add up total displacements for the pollutant for all regions
        const allRegions = regionsDisplacements[pollutant]['ALL' as RegionId];

        for (const allRegionsKey in allRegions) {
          const month = Number(allRegionsKey);
          allRegions[month].original += regionalData[month].original;
          allRegions[month].postEere += regionalData[month].postEere;
        }

        // add (and potentially combine) state data for the pollutant
        for (const stateDataKey in stateData) {
          const stateId = stateDataKey as StateId;
          // if a state's pollutant data already exists for the pollutant,
          // it was already added from another region, so add this regions's
          // monthly displacement data for the pollutant for the state
          if (statesDisplacements[pollutant][stateId]) {
            const dataset = statesDisplacements[pollutant][stateId];
            for (const datasetKey in dataset) {
              const month = Number(datasetKey);
              dataset[month].original += stateData[stateId][month].original;
              dataset[month].postEere += stateData[stateId][month].postEere;
            }
          }
          // else a state's pollutant data hasn't yet been added, so add it
          else {
            statesDisplacements[pollutant] = {
              ...statesDisplacements[pollutant],
              [stateId]: stateData[stateId],
            };
          }
        }

        // add county data for the pollutant
        for (const key in countyData) {
          const stateId = key as StateId;
          // counties exist entirely within only one region so we can safely
          // add county data to existing states (no need to combine data
          // like we did with `statesDisplacements`)
          for (const countyName in countyData[stateId]) {
            countiesDisplacements[pollutant] = {
              ...countiesDisplacements[pollutant],
              [stateId]: {
                ...countiesDisplacements[pollutant][stateId],
                [countyName]: countyData[stateId][countyName],
              },
            };
          }
        }
      }
    }
  }

  return {
    regionsDisplacements,
    statesDisplacements,
    countiesDisplacements,
  };
}

function formatNumber(num: number) {
  return Number(
    num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }),
  );
}

function formatCountyDataRow({
  pollutant,
  unit,
  monthlyData,
  regionId,
  stateId,
  countyName,
}: {
  pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25' | 'VOCS' | 'NH3';
  unit: 'emissions (pounds)' | 'emissions (tons)' | 'percent';
  monthlyData: number[];
  regionId?: RegionId;
  stateId?: StateId;
  countyName?: string;
}) {
  return {
    Pollutant: pollutant,
    'Aggregation level': regionId
      ? regionId === ('ALL' as RegionId)
        ? 'All Affected Regions'
        : `${regions[regionId].name} Region`
      : stateId && !countyName
      ? 'State'
      : stateId && countyName
      ? 'County'
      : '',
    State: stateId ? stateId : null,
    County: countyName ? countyName.replace(/city/, '(City)') : null, // format 'city'
    'Unit of measure': unit,
    'Power Sector: January': monthlyData[0],
    'Power Sector: February': monthlyData[1],
    'Power Sector: March': monthlyData[2],
    'Power Sector: April': monthlyData[3],
    'Power Sector: May': monthlyData[4],
    'Power Sector: June': monthlyData[5],
    'Power Sector: July': monthlyData[6],
    'Power Sector: August': monthlyData[7],
    'Power Sector: September': monthlyData[8],
    'Power Sector: October': monthlyData[9],
    'Power Sector: November': monthlyData[10],
    'Power Sector: December': monthlyData[11],
  };
}

function formatCobraDataRow({
  stateId,
  countyName,
  so2CountyEmissions,
  noxCountyEmissions,
  pm25CountyEmissions,
  vocsCountyEmissions,
  nh3CountyEmissions,
}: {
  stateId: StateId;
  countyName: string;
  so2CountyEmissions: number[];
  noxCountyEmissions: number[];
  pm25CountyEmissions: number[];
  vocsCountyEmissions: number[];
  nh3CountyEmissions: number[];
}): CobraDataRow {
  const match = countyFips.find((data) => {
    return (
      data['State Name'] === states[stateId as StateId].name &&
      data['County Name Long'] === countyName
    );
  });

  const so2Tons = so2CountyEmissions.reduce((a, b) => a + b, 0) / 2_000;
  const noxTons = noxCountyEmissions.reduce((a, b) => a + b, 0) / 2_000;
  const pm25Tons = pm25CountyEmissions.reduce((a, b) => a + b, 0) / 2_000;
  const vocsTons = vocsCountyEmissions.reduce((a, b) => a + b, 0) / 2_000;
  const nh3Tons = nh3CountyEmissions.reduce((a, b) => a + b, 0) / 2_000;

  return {
    FIPS: match ? match['State and County FIPS Code'] : '',
    STATE: states[stateId as StateId].name,
    COUNTY: countyName.replace(/city/, '(City)'), // format 'city'
    TIER1NAME: 'FUEL COMB. ELEC. UTIL.',
    NOx_REDUCTIONS_TONS: formatNumber(noxTons),
    SO2_REDUCTIONS_TONS: formatNumber(so2Tons),
    PM25_REDUCTIONS_TONS: formatNumber(pm25Tons),
    VOCS_REDUCTIONS_TONS: formatNumber(vocsTons),
    NH3_REDUCTIONS_TONS: formatNumber(nh3Tons),
  };
}

function setDownloadableData({
  egusNeedingReplacement,
  regionsDisplacements,
  statesDisplacements,
  countiesDisplacements,
}: {
  egusNeedingReplacement: ReplacementEGUsByPollutant;
  regionsDisplacements: RegionsDisplacementsByPollutant;
  statesDisplacements: StatesDisplacementsByPollutant;
  countiesDisplacements: CountiesDisplacementsByPollutant;
}) {
  const countyData: CountyDataRow[] = [];
  const cobraData: CobraDataRow[] = [];

  const allRegionsId = 'ALL' as RegionId;
  const allRegionsSo2 = regionsDisplacements.so2[allRegionsId];
  const allRegionsNox = regionsDisplacements.nox[allRegionsId];
  const allRegionsCo2 = regionsDisplacements.co2[allRegionsId];
  const allRegionsPm25 = regionsDisplacements.pm25[allRegionsId];
  const allRegionsVocs = regionsDisplacements.vocs[allRegionsId];
  const allRegionsNh3 = regionsDisplacements.nh3[allRegionsId];

  if (
    !allRegionsSo2 ||
    !allRegionsNox ||
    !allRegionsCo2 ||
    !allRegionsPm25 ||
    !allRegionsVocs ||
    !allRegionsNh3
  ) {
    return { countyData, cobraData };
  }

  const flaggedSo2EGUs = egusNeedingReplacement.so2;
  const flaggedNoxEGUs = egusNeedingReplacement.nox;
  const flaggedCo2EGUs = egusNeedingReplacement.co2;

  // NOTE: the same regions exist for all pollutants, so we'll just loop over
  // so2 (but could use any of the other pollutants and get the same regions)
  const sortedRegionIds = Object.keys(regionsDisplacements.so2)
    .filter((regionId) => regionId !== 'ALL')
    .sort((a, b) => {
      const regionA = regions[a as RegionId];
      const regionB = regions[b as RegionId];
      return regionA.name.localeCompare(regionB.name);
    });

  // if there's more than one region, add "all regions" displacement data
  // to countyData array
  if (sortedRegionIds.length > 1) {
    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(allRegionsSo2, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(allRegionsNox, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'emissions (tons)',
        monthlyData: calculateMonthlyData(allRegionsCo2, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(allRegionsPm25, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(allRegionsVocs, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(allRegionsNh3, 'emissions'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'percent',
        monthlyData:
          flaggedSo2EGUs.length > 0
            ? Array(12)
            : calculateMonthlyData(allRegionsSo2, 'percentages'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'percent',
        monthlyData:
          flaggedNoxEGUs.length > 0
            ? Array(12)
            : calculateMonthlyData(allRegionsNox, 'percentages'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'percent',
        monthlyData:
          flaggedCo2EGUs.length > 0
            ? Array(12)
            : calculateMonthlyData(allRegionsCo2, 'percentages'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'percent',
        monthlyData: calculateMonthlyData(allRegionsPm25, 'percentages'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'percent',
        monthlyData: calculateMonthlyData(allRegionsVocs, 'percentages'),
        regionId: allRegionsId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'percent',
        monthlyData: calculateMonthlyData(allRegionsNh3, 'percentages'),
        regionId: allRegionsId,
      }),
    );
  }

  // add each region's displacement data to countyData array
  for (const id of sortedRegionIds) {
    const regionId = id as RegionId;

    // skip "all regions" displacement data, as its already been handled above
    if (id === 'ALL') continue;

    const regionSo2 = regionsDisplacements.so2[regionId];
    const regionNox = regionsDisplacements.nox[regionId];
    const regionCo2 = regionsDisplacements.co2[regionId];
    const regionPm25 = regionsDisplacements.pm25[regionId];
    const regionVocs = regionsDisplacements.vocs[regionId];
    const regionNh3 = regionsDisplacements.nh3[regionId];

    if (
      !regionSo2 ||
      !regionNox ||
      !regionCo2 ||
      !regionPm25 ||
      !regionVocs ||
      !regionNh3
    ) {
      return { countyData, cobraData };
    }

    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(regionSo2, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(regionNox, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'emissions (tons)',
        monthlyData: calculateMonthlyData(regionCo2, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(regionPm25, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(regionVocs, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(regionNh3, 'emissions'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'percent',
        monthlyData: flaggedSo2EGUs.some((egu) => egu.regionId === regionId)
          ? Array(12)
          : calculateMonthlyData(regionSo2, 'percentages'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'percent',
        monthlyData: flaggedNoxEGUs.some((egu) => egu.regionId === regionId)
          ? Array(12)
          : calculateMonthlyData(regionNox, 'percentages'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'percent',
        monthlyData: flaggedCo2EGUs.some((egu) => egu.regionId === regionId)
          ? Array(12)
          : calculateMonthlyData(regionCo2, 'percentages'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'percent',
        monthlyData: calculateMonthlyData(regionPm25, 'percentages'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'percent',
        monthlyData: calculateMonthlyData(regionVocs, 'percentages'),
        regionId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'percent',
        monthlyData: calculateMonthlyData(regionNh3, 'percentages'),
        regionId,
      }),
    );
  }

  // add each state's displacement data to countyData array
  // NOTE: the same regions exist for all pollutants, so we'll just loop over
  // so2 (but could use any of the other pollutants and get the same regions)
  const sortedStateIds = Object.keys(statesDisplacements.so2).sort();

  for (const id of sortedStateIds) {
    const stateId = id as StateId;

    const stateSo2 = statesDisplacements.so2[stateId];
    const stateNox = statesDisplacements.nox[stateId];
    const stateCo2 = statesDisplacements.co2[stateId];
    const statePm25 = statesDisplacements.pm25[stateId];
    const stateVocs = statesDisplacements.vocs[stateId];
    const stateNh3 = statesDisplacements.nh3[stateId];

    if (
      !stateSo2 ||
      !stateNox ||
      !stateCo2 ||
      !statePm25 ||
      !stateVocs ||
      !stateNh3
    ) {
      return { countyData, cobraData };
    }

    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(stateSo2, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(stateNox, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'emissions (tons)',
        monthlyData: calculateMonthlyData(stateCo2, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(statePm25, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(stateVocs, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'emissions (pounds)',
        monthlyData: calculateMonthlyData(stateNh3, 'emissions'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'SO2',
        unit: 'percent',
        monthlyData: flaggedSo2EGUs.some((egu) => egu.state === stateId)
          ? Array(12)
          : calculateMonthlyData(stateSo2, 'percentages'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NOX',
        unit: 'percent',
        monthlyData: flaggedNoxEGUs.some((egu) => egu.state === stateId)
          ? Array(12)
          : calculateMonthlyData(stateNox, 'percentages'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'CO2',
        unit: 'percent',
        monthlyData: flaggedCo2EGUs.some((egu) => egu.state === stateId)
          ? Array(12)
          : calculateMonthlyData(stateCo2, 'percentages'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'PM25',
        unit: 'percent',
        monthlyData: calculateMonthlyData(statePm25, 'percentages'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'VOCS',
        unit: 'percent',
        monthlyData: calculateMonthlyData(stateVocs, 'percentages'),
        stateId,
      }),
    );

    countyData.push(
      formatCountyDataRow({
        pollutant: 'NH3',
        unit: 'percent',
        monthlyData: calculateMonthlyData(stateNh3, 'percentages'),
        stateId,
      }),
    );
  }

  // add each county's displacement data to countyData array
  // NOTE: the same regions exist for all pollutants, so we'll just loop over
  // so2 (but could use any of the other pollutants and get the same regions)
  const sortedCountyStateIds = Object.keys(countiesDisplacements.so2).sort();

  for (const id of sortedCountyStateIds) {
    const stateId = id as StateId;

    const stateSo2 = countiesDisplacements.so2[stateId];
    const stateNox = countiesDisplacements.nox[stateId];
    const stateCo2 = countiesDisplacements.co2[stateId];
    const statePm25 = countiesDisplacements.pm25[stateId];
    const stateVocs = countiesDisplacements.vocs[stateId];
    const stateNh3 = countiesDisplacements.nh3[stateId];

    if (
      !stateSo2 ||
      !stateNox ||
      !stateCo2 ||
      !statePm25 ||
      !stateVocs ||
      !stateNh3
    ) {
      return { countyData, cobraData };
    }

    const sortedCountyNames = Object.keys(stateSo2).sort();

    for (const countyName of sortedCountyNames) {
      const countySo2 = stateSo2[countyName];
      const countyNox = stateNox[countyName];
      const countyCo2 = stateCo2[countyName];
      const countyPm25 = statePm25[countyName];
      const countyVocs = stateVocs[countyName];
      const countyNh3 = stateNh3[countyName];

      countyData.push(
        formatCountyDataRow({
          pollutant: 'SO2',
          unit: 'emissions (pounds)',
          monthlyData: calculateMonthlyData(countySo2, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'NOX',
          unit: 'emissions (pounds)',
          monthlyData: calculateMonthlyData(countyNox, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'CO2',
          unit: 'emissions (tons)',
          monthlyData: calculateMonthlyData(countyCo2, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'PM25',
          unit: 'emissions (pounds)',
          monthlyData: calculateMonthlyData(countyPm25, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'VOCS',
          unit: 'emissions (pounds)',
          monthlyData: calculateMonthlyData(countyVocs, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'NH3',
          unit: 'emissions (pounds)',
          monthlyData: calculateMonthlyData(countyNh3, 'emissions'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'SO2',
          unit: 'percent',
          monthlyData: flaggedSo2EGUs.some(
            (egu) => egu.state === stateId && egu.county === countyName,
          )
            ? Array(12)
            : calculateMonthlyData(countySo2, 'percentages'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'NOX',
          unit: 'percent',
          monthlyData: flaggedNoxEGUs.some(
            (egu) => egu.state === stateId && egu.county === countyName,
          )
            ? Array(12)
            : calculateMonthlyData(countyNox, 'percentages'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'CO2',
          unit: 'percent',
          monthlyData: flaggedCo2EGUs.some(
            (egu) => egu.state === stateId && egu.county === countyName,
          )
            ? Array(12)
            : calculateMonthlyData(countyCo2, 'percentages'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'PM25',
          unit: 'percent',
          monthlyData: calculateMonthlyData(countyPm25, 'percentages'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'VOCS',
          unit: 'percent',
          monthlyData: calculateMonthlyData(countyVocs, 'percentages'),
          stateId,
          countyName,
        }),
      );

      countyData.push(
        formatCountyDataRow({
          pollutant: 'NH3',
          unit: 'percent',
          monthlyData: calculateMonthlyData(countyNh3, 'percentages'),
          stateId,
          countyName,
        }),
      );

      cobraData.push(
        formatCobraDataRow({
          stateId,
          countyName,
          so2CountyEmissions: calculateMonthlyData(countySo2, 'emissions'),
          noxCountyEmissions: calculateMonthlyData(countyNox, 'emissions'),
          pm25CountyEmissions: calculateMonthlyData(countyPm25, 'emissions'),
          vocsCountyEmissions: calculateMonthlyData(countyVocs, 'emissions'),
          nh3CountyEmissions: calculateMonthlyData(countyNh3, 'emissions'),
        }),
      );
    }
  }

  return { countyData, cobraData };
}
