// reducers
import { AppThunk } from 'app/redux/index';
// action creators
import {
  DataByMonth,
  MonthlyChanges,
  renderMonthlyEmissionsCharts,
} from './monthlyEmissions';
// config
import { RegionId, StateId, states, fipsCodes } from 'app/config';

type PollutantName = 'generation' | 'so2' | 'nox' | 'co2' | 'pm25';

type PollutantDisplacement = {
  regionId: RegionId;
  pollutant: PollutantName;
  original: number;
  post: number;
  impact: number;
  monthlyChanges: MonthlyChanges;
  stateChanges: Partial<{ [key in StateId]: number }>;
};

type RegionalDisplacement = {
  generation: PollutantDisplacement;
  so2: PollutantDisplacement;
  nox: PollutantDisplacement;
  co2: PollutantDisplacement;
  pm25: PollutantDisplacement;
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
  stateChanges: Partial<{ [key in StateId]: StateChange }>;
  statesAndCounties: StatesAndCounties;
  downloadableCountyData: CountyDataRow[];
  downloadableCobraData: CobraDataRow[];
};

// reducer
const initialState: DisplacementState = {
  status: 'ready',
  regionalDisplacements: {},
  stateChanges: {},
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

      // if state hasn't already been added to stateChanges,
      // add it with initial zero values for each pollutant
      if (!updatedState.stateChanges[stateId]) {
        updatedState.stateChanges[stateId] = {
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
        updatedState.stateChanges[stateId]?.[pollutantName] || 0;

      return {
        ...updatedState,
        stateChanges: {
          ...updatedState.stateChanges,
          [stateId]: {
            ...updatedState.stateChanges[stateId],
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
            hourlyLoad: regionalProfile?.hourlyEere,
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

        // build up changes by state for each region (additive)
        regionalDisplacements.forEach((displacement) => {
          for (const key in displacement.stateChanges) {
            const stateId = key as StateId;

            dispatch({
              type: 'displacement/ADD_STATE_CHANGES',
              payload: {
                stateId,
                pollutantName: displacement.pollutant,
                pollutantValue: displacement.stateChanges[stateId] || 0,
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

    // build up statesAndCounties from each region's monthlyChanges data
    const statesAndCounties: StatesAndCounties = {};

    for (const regionId in displacement.regionalDisplacements) {
      // regional displacement data
      const data = displacement.regionalDisplacements[regionId as RegionId];

      if (data) {
        // states and counties are the same for all pollutants, so we'll
        // just use generation (it really doesn't matter which we use)
        const countyEmissions = data.generation.monthlyChanges.emissions.county;

        for (const key in countyEmissions) {
          const stateId = key as StateId;
          const stateCountyNames = Object.keys(countyEmissions[stateId]).sort();
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

function formatRegionalDownloadData(
  regionalDisplacement: RegionalDisplacement,
  statesAndCounties: StatesAndCounties,
) {
  const so2Emissions = regionalDisplacement.so2.monthlyChanges.emissions;
  const so2Percentages = regionalDisplacement.so2.monthlyChanges.percentages;

  const noxEmissions = regionalDisplacement.nox.monthlyChanges.emissions;
  const noxPercentages = regionalDisplacement.nox.monthlyChanges.percentages;

  const co2Emissions = regionalDisplacement.co2.monthlyChanges.emissions;
  const co2Percentages = regionalDisplacement.co2.monthlyChanges.percentages;

  const pm25Emissions = regionalDisplacement.pm25.monthlyChanges.emissions;
  const pm25Percentages = regionalDisplacement.pm25.monthlyChanges.percentages;

  const countyData: CountyDataRow[] = [];
  const cobraData: CobraDataRow[] = [];

  // ------ region data ------
  // add county data for each polutant, unit, and region
  countyData.push(countyRow('SO2', 'emissions (pounds)', so2Emissions.region));
  countyData.push(countyRow('NOX', 'emissions (pounds)', noxEmissions.region));
  countyData.push(countyRow('CO2', 'emissions (tons)', co2Emissions.region));
  countyData.push(countyRow('PM25', 'emissions (pounds)', pm25Emissions.region)); // prettier-ignore
  countyData.push(countyRow('SO2', 'percent', so2Percentages.region));
  countyData.push(countyRow('NOX', 'percent', noxPercentages.region));
  countyData.push(countyRow('CO2', 'percent', co2Percentages.region));
  countyData.push(countyRow('PM25', 'percent', pm25Percentages.region));

  // NOTE: conditinal check is needed before attempting to add state and county
  // data below because `statesAndCounties` is combined from all of the selected
  // regions, but `formatRegionalDownloadData()` (this function) is run on each
  // region's regional displacement results, so some states and counties won't
  // exist in every selected region's regional displacements results

  // ------ states data ------
  // prettier-ignore
  (Object.keys(statesAndCounties) as StateId[]).forEach((s) => {
    // add county data for each polutant, unit, and state
    if (so2Emissions.state[s]) {
      countyData.push(countyRow('SO2', 'emissions (pounds)', so2Emissions.state[s], s));
    }
    if (noxEmissions.state[s]) {
      countyData.push(countyRow('NOX', 'emissions (pounds)', noxEmissions.state[s], s));
    }
    if (co2Emissions.state[s]) {
      countyData.push(countyRow('CO2', 'emissions (tons)', co2Emissions.state[s], s));
    }
    if (pm25Emissions.state[s]) {
      countyData.push(countyRow('PM25', 'emissions (pounds)', pm25Emissions.state[s], s));
    }
    if (so2Percentages.state[s]) {
      countyData.push(countyRow('SO2', 'percent', so2Percentages.state[s], s));
    }
    if (noxPercentages.state[s]) {
      countyData.push(countyRow('NOX', 'percent', noxPercentages.state[s], s));
    }
    if (co2Percentages.state[s]) {
      countyData.push(countyRow('CO2', 'percent', co2Percentages.state[s], s));
    }
    if (pm25Percentages.state[s]) {
      countyData.push(countyRow('PM25', 'percent', pm25Percentages.state[s], s));
    }

    // ------ counties data ------
    statesAndCounties[s]?.forEach((c) => {
      // add county data for each polutant, unit, and county
      if (so2Emissions.county[s]?.[c]) {
        countyData.push(countyRow('SO2', 'emissions (pounds)', so2Emissions.county[s][c], s, c));
      }
      if (noxEmissions.county[s]?.[c]) {
        countyData.push(countyRow('NOX', 'emissions (pounds)', noxEmissions.county[s][c], s, c));
      }
      if (co2Emissions.county[s]?.[c]) {
        countyData.push(countyRow('CO2', 'emissions (tons)', co2Emissions.county[s][c], s, c));
      }
      if (pm25Emissions.county[s]?.[c]) {
        countyData.push(countyRow('PM25', 'emissions (pounds)', pm25Emissions.county[s][c], s, c));
      }
      if (so2Percentages.county[s]?.[c]) {
        countyData.push(countyRow('SO2', 'percent', so2Percentages.county[s][c], s, c));
      }
      if (noxPercentages.county[s]?.[c]) {
        countyData.push(countyRow('NOX', 'percent', noxPercentages.county[s][c], s, c));
      }
      if (co2Percentages.county[s]?.[c]) {
        countyData.push(countyRow('CO2', 'percent', co2Percentages.county[s][c], s, c));
      }
      if (pm25Percentages.county[s]?.[c]) {
        countyData.push(countyRow('PM25', 'percent', pm25Percentages.county[s][c], s, c));
      }

      // add cobra data for each county
      const so2CountyEmissions = so2Emissions.county[s]?.[c];
      const noxCountyEmissions = noxEmissions.county[s]?.[c];
      const pm25CountyEmissions = pm25Emissions.county[s]?.[c];

      if (so2CountyEmissions && noxCountyEmissions && pm25CountyEmissions) {
        cobraData.push(cobraRow(s, c, so2CountyEmissions, noxCountyEmissions, pm25CountyEmissions));
      }
    });
  });

  return { countyData, cobraData };
}

/**
 * helper function to format downloadable county data rows
 */
function countyRow(
  pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25',
  unit: 'emissions (pounds)' | 'emissions (tons)' | 'percent',
  data: DataByMonth,
  stateId?: StateId,
  county?: string,
): CountyDataRow {
  const dataByMonth = Object.values(data);

  // format 'city' if found in county name
  const countyName = county ? county.replace(/city/, '(City)') : null;

  return {
    Pollutant: pollutant,
    'Aggregation level': county
      ? 'County'
      : stateId
      ? 'State'
      : 'AVERT Region(s)',
    State: stateId ? stateId : null,
    County: countyName,
    'Unit of measure': unit,
    January: dataByMonth[0],
    February: dataByMonth[1],
    March: dataByMonth[2],
    April: dataByMonth[3],
    May: dataByMonth[4],
    June: dataByMonth[5],
    July: dataByMonth[6],
    August: dataByMonth[7],
    September: dataByMonth[8],
    October: dataByMonth[9],
    November: dataByMonth[10],
    December: dataByMonth[11],
  };
}

/**
 * helper function to format cobra county data rows
 */
function cobraRow(
  stateId: StateId,
  county: string,
  so2CountyEmissions: DataByMonth,
  noxCountyEmissions: DataByMonth,
  pm25CountyEmissions: DataByMonth,
): CobraDataRow {
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
    stateId === 'LA' ? county.replace(/ Parish$/, ' County') : county;

  const matchedFipsCodeItem = fipsCodes.filter((item) => {
    return (
      item['state'] === states[stateId as StateId].name &&
      item['county'].replace(/city County$/, 'city') === fipsCounty
    );
  })[0];

  const fipsCode = matchedFipsCodeItem ? matchedFipsCodeItem['code'] : '';

  // format 'city' if found in county name
  const countyName = county.replace(/city/, '(City)');

  const sum = (a: number, b: number) => a + b;

  const so2DataTons = Object.values(so2CountyEmissions).reduce(sum, 0) / 2000;
  const noxDataTons = Object.values(noxCountyEmissions).reduce(sum, 0) / 2000;
  const pm25DataTons = Object.values(pm25CountyEmissions).reduce(sum, 0) / 2000;

  function formatNumber(number: number) {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  }

  return {
    FIPS: fipsCode,
    STATE: states[stateId as StateId].name,
    COUNTY: countyName,
    TIER1NAME: 'FUEL COMB. ELEC. UTIL.',
    NOx_REDUCTIONS_TONS: formatNumber(noxDataTons),
    SO2_REDUCTIONS_TONS: formatNumber(so2DataTons),
    PM25_REDUCTIONS_TONS: formatNumber(pm25DataTons),
  };
}
