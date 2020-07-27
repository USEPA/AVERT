// reducers
import { AppThunk } from 'app/redux/index';
// action creators
import { MonthlyUnit, renderMonthlyEmissionsCharts } from './monthlyEmissions';
// config
import { RegionId, StateId, states, fipsCodes } from 'app/config';

export type PollutantName = 'generation' | 'so2' | 'nox' | 'co2' | 'pm25';

type MonthKey =
  | 'month1'
  | 'month2'
  | 'month3'
  | 'month4'
  | 'month5'
  | 'month6'
  | 'month7'
  | 'month8'
  | 'month9'
  | 'month10'
  | 'month11'
  | 'month12';

export type MonthlyDisplacement = {
  [month in MonthKey]: {
    original: number;
    postEere: number;
  };
};

type PollutantDisplacement = {
  regionId: RegionId;
  pollutant: PollutantName;
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

type RegionalDisplacement = {
  [key in PollutantName]: PollutantDisplacement;
};

export type StateChange = {
  id: StateId;
  name: string;
  generation: number;
  so2: number;
  nox: number;
  co2: number;
  pm25: number;
};

type StatesAndCounties = Partial<{ [key in StateId]: string[] }>;

type CountyDataRow = {
  Pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25';
  'Aggregation level': 'County' | 'State' | 'AVERT Region(s)';
  State: string | null;
  County: string | null;
  'Unit of measure': 'emissions (pounds)' | 'emissions (tons)' | 'percent';
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  December: number;
};

type CobraDataRow = {
  FIPS: string;
  STATE: string;
  COUNTY: string;
  TIER1NAME: string;
  NOx_REDUCTIONS_TONS: string;
  SO2_REDUCTIONS_TONS: string;
  PM25_REDUCTIONS_TONS: string;
};

type DisplacementAction =
  | { type: 'geography/SELECT_REGION' }
  | { type: 'displacement/INCREMENT_PROGRESS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | { type: 'displacement/COMPLETE_DISPLACEMENT' }
  | { type: 'displacement/RESET_DISPLACEMENT' }
  | { type: 'displacement/REQUEST_DISPLACEMENT_DATA' }
  | {
      type: 'displacement/RECEIVE_DISPLACEMENT_DATA';
      payload: { data: PollutantDisplacement };
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
      type: 'displacement/STORE_DOWNLOAD_DATA';
      payload: {
        countyData: CountyDataRow[];
        cobraData: CobraDataRow[];
      };
    };

type DisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  regionalDisplacements: Partial<{ [key in RegionId]: RegionalDisplacement }>;
  combinedStateChanges: Partial<{ [key in StateId]: StateChange }>;
  statesAndCounties: StatesAndCounties;
  downloadableCountyData: CountyDataRow[];
  downloadableCobraData: CobraDataRow[];
};

// reducer
const initialState: DisplacementState = {
  status: 'ready',
  regionalDisplacements: {},
  combinedStateChanges: {},
  statesAndCounties: {},
  downloadableCountyData: [],
  downloadableCobraData: [],
};

export default function reducer(
  state: DisplacementState = initialState,
  action: DisplacementAction,
): DisplacementState {
  switch (action.type) {
    case 'geography/SELECT_REGION':
    case 'displacement/RESET_DISPLACEMENT': {
      return initialState;
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

    case 'displacement/REQUEST_DISPLACEMENT_DATA':
    case 'displacement/INCREMENT_PROGRESS': {
      return state;
    }

    case 'displacement/RECEIVE_DISPLACEMENT_DATA': {
      const { data } = action.payload;

      return {
        ...state,
        regionalDisplacements: {
          ...state.regionalDisplacements,
          [data.regionId]: {
            ...state.regionalDisplacements[data.regionId],
            [data.pollutant]: {
              ...data,
            },
          },
        },
      };
    }

    case 'displacement/ADD_STATE_CHANGES': {
      const updatedState = { ...state };
      const { stateId, pollutantName, pollutantValue } = action.payload;

      // if state hasn't already been added to combinedStateChanges,
      // add it with initial zero values for each pollutant
      if (!updatedState.combinedStateChanges[stateId]) {
        updatedState.combinedStateChanges[stateId] = {
          id: stateId,
          name: states[stateId].name,
          generation: 0,
          so2: 0,
          nox: 0,
          co2: 0,
          pm25: 0,
        };
      }

      // add dispatched pollutant value to previous pollutant value
      const previousPollutantValue =
        updatedState.combinedStateChanges[stateId]?.[pollutantName] || 0;

      return {
        ...updatedState,
        combinedStateChanges: {
          ...updatedState.combinedStateChanges,
          [stateId]: {
            ...updatedState.combinedStateChanges[stateId],
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

    case 'displacement/STORE_DOWNLOAD_DATA': {
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

function fetchDisplacementData(pollutant: PollutantName): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_DISPLACEMENT_DATA' });

    // build up displacement requests for selected regions
    const displacementRequests: Promise<Response>[] = [];

    for (const regionId in eere.regionalProfiles) {
      const regionalProfile = eere.regionalProfiles[regionId as RegionId];

      displacementRequests.push(
        fetch(`${api.baseUrl}/api/v1/${pollutant}`, {
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
          return response.json().then((data: PollutantDisplacement) => {
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
          for (const key in displacement.stateData) {
            const stateId = key as StateId;
            const stateData = displacement.stateData[stateId];

            // total each month's state emissions change for the given state
            let stateEmissionsChange = 0;
            for (const month in stateData) {
              const { original, postEere } = stateData[month as MonthKey];
              stateEmissionsChange += postEere - original;
            }

            dispatch({
              type: 'displacement/ADD_STATE_CHANGES',
              payload: {
                stateId,
                pollutantName: displacement.pollutant,
                pollutantValue: stateEmissionsChange,
              },
            });
          }
        });
      });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'displacement/START_DISPLACEMENT' });
    // whenever we call `incrementProgress()` the progress bar in
    // `components/Panels.tsx` is incremented. we'll initially increment it
    // before fetching any displacement data to give the user a visual que
    // something is happening, and then increment it after each set of
    // displacement data is returned inside the `fetchDisplacementData()`
    // function.
    dispatch(incrementProgress());
    // NOTE: if in the futre we ever fetch data for more pollutants than the 5
    // below (generation, so2, nox, co2, pm25), the value of the `loadingSteps`
    // state stored in `redux/reducers/panel.ts` will need to be updated to be
    // the total number of pollutant displacements + 1
    dispatch(fetchDisplacementData('generation'));
    dispatch(fetchDisplacementData('so2'));
    dispatch(fetchDisplacementData('nox'));
    dispatch(fetchDisplacementData('co2'));
    dispatch(fetchDisplacementData('pm25'));

    dispatch(receiveDisplacement());
  };
}

function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { panel, displacement } = getState();

    // recursively call function if data is still fetching
    if (panel.loadingProgress !== panel.loadingSteps) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    // build up statesAndCounties from each region's county data
    const statesAndCounties: StatesAndCounties = {};

    for (const regionId in displacement.regionalDisplacements) {
      // regional displacement data
      const data = displacement.regionalDisplacements[regionId as RegionId];

      if (data) {
        // states and counties are the same for all pollutants, so we'll
        // just use generation (it really doesn't matter which we use)
        const { countyData } = data.generation;

        for (const key in countyData) {
          const stateId = key as StateId;
          const stateCountyNames = Object.keys(countyData[stateId]).sort();
          // initialize counties array for state, if state doesn't already exist
          // in `statesAndCounties` and add state county names to array
          // (we initialize and push counties instead of directly assigning
          // counties to a state because states exist within multiple regions,
          // but counties only exist within a single region)
          if (!statesAndCounties[stateId]) statesAndCounties[stateId] = [];
          statesAndCounties[stateId]?.push(...stateCountyNames);
        }
      }
    }

    // sort county names within each state
    for (const key in statesAndCounties) {
      const stateId = key as StateId;
      statesAndCounties[stateId] = statesAndCounties[stateId]?.sort();
    }

    dispatch({
      type: 'displacement/STORE_STATES_AND_COUNTIES',
      payload: { statesAndCounties },
    });

    // build up downloadable county and cobra data from each region
    const allRegionsCountyData: CountyDataRow[] = [];
    const allRegionsCobraData: CobraDataRow[] = [];

    for (const regionId in displacement.regionalDisplacements) {
      // regional displacement data
      const data = displacement.regionalDisplacements[regionId as RegionId];

      if (data) {
        const { countyData, cobraData } = formatRegionalDownloadData(
          data,
          statesAndCounties,
        );

        allRegionsCountyData.push(...countyData);
        allRegionsCobraData.push(...cobraData);
      }
    }

    dispatch({
      type: 'displacement/STORE_DOWNLOAD_DATA',
      payload: {
        countyData: allRegionsCountyData,
        cobraData: allRegionsCobraData,
      },
    });

    dispatch({ type: 'displacement/COMPLETE_DISPLACEMENT' });

    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function resetDisplacement(): DisplacementAction {
  return { type: 'displacement/RESET_DISPLACEMENT' };
}

export function calculateMonthlyData(
  data: MonthlyDisplacement,
  unit: MonthlyUnit,
) {
  const monthlyEmissions: number[] = [];
  const monthlyPercentages: number[] = [];

  for (const month in data) {
    const { original, postEere } = data[month as MonthKey];
    const emissions = postEere - original;
    const percentage = (emissions / original) * 100;
    monthlyEmissions.push(emissions);
    monthlyPercentages.push(percentage);
  }

  return unit === 'emissions' ? monthlyEmissions : monthlyPercentages;
}

function calculateMonthlyEmissions(data: MonthlyDisplacement) {
  return calculateMonthlyData(data, 'emissions');
}

function calculateMonthlyPercents(data: MonthlyDisplacement) {
  return calculateMonthlyData(data, 'percentages');
}

function formatRegionalDownloadData(
  regionalDisplacement: RegionalDisplacement,
  statesAndCounties: StatesAndCounties,
) {
  const { so2, nox, co2, pm25 } = regionalDisplacement;

  const countyData: CountyDataRow[] = [];
  const cobraData: CobraDataRow[] = [];

  function addCountyRow({
    pollutant,
    unit,
    data,
    stateId,
    countyName,
  }: {
    pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25';
    unit: 'emissions (pounds)' | 'emissions (tons)' | 'percent';
    data: number[];
    stateId?: StateId;
    countyName?: string;
  }) {
    if (!data) return;
    countyData.push({
      Pollutant: pollutant,
      'Aggregation level': countyName
        ? 'County'
        : stateId
        ? 'State'
        : 'AVERT Region(s)',
      State: stateId ? stateId : null,
      County: countyName ? countyName.replace(/city/, '(City)') : null, // format 'city'
      'Unit of measure': unit,
      January: data[0],
      February: data[1],
      March: data[2],
      April: data[3],
      May: data[4],
      June: data[5],
      July: data[6],
      August: data[7],
      September: data[8],
      October: data[9],
      November: data[10],
      December: data[11],
    });
  }

  function addCobraRow({
    stateId,
    countyName,
    so2CountyEmissions,
    noxCountyEmissions,
    pm25CountyEmissions,
  }: {
    stateId: StateId;
    countyName: string;
    so2CountyEmissions: number[];
    noxCountyEmissions: number[];
    pm25CountyEmissions: number[];
  }) {
    if (!so2CountyEmissions || !noxCountyEmissions || !pm25CountyEmissions) {
      return;
    }

    /**
     * All items in the `fipsCodes` array (which is data converted from the main
     * AVERT Excel file) have the word 'County' at the end of their county names.
     * This is correct in most cases but incorrect for two:
     * - counties in Louisiana are called parishes
     * - cities shouldn't have the word 'County' at the end of their name
     *
     * So we first handle Louisiana parishes by converting the passed county name
     * to use 'County' instead of 'Parish', so we can match it to its correct FIPS
     * code (e.g. the passed county 'Acadia Parish' becomes 'Avadia County')
     *
     * Then when we match on county names, we need to trim off the extra 'County'
     * string if its actually a city. For example, in the `fipsCodes` array,
     * the city of Baltimore is stored as 'Baltimore city County', but in the RDF
     * it's stored as 'Baltimore city', so we need to use that name for matching
     */
    const fipsCounty =
      stateId === 'LA' ? countyName.replace(/ Parish$/, ' County') : countyName;

    const matchedFipsCodeItem = fipsCodes.filter((item) => {
      return (
        item['state'] === states[stateId as StateId].name &&
        item['county'].replace(/city County$/, 'city') === fipsCounty
      );
    })[0];

    const fipsCode = matchedFipsCodeItem ? matchedFipsCodeItem['code'] : '';

    const sum = (a: number, b: number) => a + b;

    const so2Tons = so2CountyEmissions.reduce(sum, 0) / 2000;
    const noxTons = noxCountyEmissions.reduce(sum, 0) / 2000;
    const pm25Tons = pm25CountyEmissions.reduce(sum, 0) / 2000;

    function formatNumber(number: number) {
      return number.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      });
    }

    cobraData.push({
      FIPS: fipsCode,
      STATE: states[stateId as StateId].name,
      COUNTY: countyName.replace(/city/, '(City)'), // format 'city'
      TIER1NAME: 'FUEL COMB. ELEC. UTIL.',
      NOx_REDUCTIONS_TONS: formatNumber(noxTons),
      SO2_REDUCTIONS_TONS: formatNumber(so2Tons),
      PM25_REDUCTIONS_TONS: formatNumber(pm25Tons),
    });
  }

  // region data: add county data for each polutant, unit, and region
  addCountyRow({
    pollutant: 'SO2',
    unit: 'emissions (pounds)',
    data: calculateMonthlyEmissions(so2.regionalData),
  });

  addCountyRow({
    pollutant: 'NOX',
    unit: 'emissions (pounds)',
    data: calculateMonthlyEmissions(nox.regionalData),
  });

  addCountyRow({
    pollutant: 'CO2',
    unit: 'emissions (tons)',
    data: calculateMonthlyEmissions(co2.regionalData),
  });

  addCountyRow({
    pollutant: 'PM25',
    unit: 'emissions (pounds)',
    data: calculateMonthlyEmissions(pm25.regionalData),
  });

  addCountyRow({
    pollutant: 'SO2',
    unit: 'percent',
    data: calculateMonthlyPercents(so2.regionalData),
  });

  addCountyRow({
    pollutant: 'NOX',
    unit: 'percent',
    data: calculateMonthlyPercents(nox.regionalData),
  });

  addCountyRow({
    pollutant: 'CO2',
    unit: 'percent',
    data: calculateMonthlyPercents(co2.regionalData),
  });

  addCountyRow({
    pollutant: 'PM25',
    unit: 'percent',
    data: calculateMonthlyPercents(pm25.regionalData),
  });

  // NOTE: conditinal check is needed before attempting to add state and county
  // data below because `statesAndCounties` is combined from all of the selected
  // regions, but `formatRegionalDownloadData()` (this function) is run on each
  // region's regional displacement results, so some states and counties won't
  // exist in every selected region's regional displacements results

  // states data: add county data for each polutant, unit, and state
  (Object.keys(statesAndCounties) as StateId[]).forEach((stateId) => {
    const so2StateData = so2.stateData[stateId];
    const noxStateData = nox.stateData[stateId];
    const co2StateData = co2.stateData[stateId];
    const pm25StateData = pm25.stateData[stateId];

    addCountyRow({
      pollutant: 'SO2',
      unit: 'emissions (pounds)',
      data: calculateMonthlyEmissions(so2StateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'NOX',
      unit: 'emissions (pounds)',
      data: calculateMonthlyEmissions(noxStateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'CO2',
      unit: 'emissions (tons)',
      data: calculateMonthlyEmissions(co2StateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'PM25',
      unit: 'emissions (pounds)',
      data: calculateMonthlyEmissions(pm25StateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'SO2',
      unit: 'percent',
      data: calculateMonthlyPercents(so2StateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'NOX',
      unit: 'percent',
      data: calculateMonthlyPercents(noxStateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'CO2',
      unit: 'percent',
      data: calculateMonthlyPercents(co2StateData),
      stateId,
    });

    addCountyRow({
      pollutant: 'PM25',
      unit: 'percent',
      data: calculateMonthlyPercents(pm25StateData),
      stateId,
    });

    // counties data: add county data for each polutant, unit, and county
    statesAndCounties[stateId]?.forEach((countyName) => {
      const so2CountyData = so2.countyData[stateId]?.[countyName];
      const noxCountyData = nox.countyData[stateId]?.[countyName];
      const co2CountyData = co2.countyData[stateId]?.[countyName];
      const pm25CountyData = pm25.countyData[stateId]?.[countyName];

      addCountyRow({
        pollutant: 'SO2',
        unit: 'emissions (pounds)',
        data: calculateMonthlyEmissions(so2CountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'NOX',
        unit: 'emissions (pounds)',
        data: calculateMonthlyEmissions(noxCountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'CO2',
        unit: 'emissions (tons)',
        data: calculateMonthlyEmissions(co2CountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'PM25',
        unit: 'emissions (pounds)',
        data: calculateMonthlyEmissions(pm25CountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'SO2',
        unit: 'percent',
        data: calculateMonthlyPercents(so2CountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'NOX',
        unit: 'percent',
        data: calculateMonthlyPercents(noxCountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'CO2',
        unit: 'percent',
        data: calculateMonthlyPercents(co2CountyData),
        stateId,
        countyName,
      });

      addCountyRow({
        pollutant: 'PM25',
        unit: 'percent',
        data: calculateMonthlyPercents(pm25CountyData),
        stateId,
        countyName,
      });

      // add cobra data for each county
      addCobraRow({
        stateId,
        countyName,
        so2CountyEmissions: calculateMonthlyEmissions(so2CountyData),
        noxCountyEmissions: calculateMonthlyEmissions(noxCountyData),
        pm25CountyEmissions: calculateMonthlyEmissions(pm25CountyData),
      });
    });
  });

  return { countyData, cobraData };
}
