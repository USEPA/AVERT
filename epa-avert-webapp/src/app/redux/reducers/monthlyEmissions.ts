// reducers
import { AppThunk } from 'app/redux/index';
import { StatesAndCounties } from 'app/redux/reducers/displacement';
// config
import { StateId, states, fipsCodes } from 'app/config';

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

export type MonthlyChanges = {
  emissions: {
    region: DataByMonth;
    state: {
      [stateId: string]: DataByMonth;
    };
    county: {
      [stateId: string]: {
        [countyName: string]: DataByMonth;
      };
    };
  };
  percentages: {
    region: DataByMonth;
    state: {
      [stateId: string]: DataByMonth;
    };
    county: {
      [stateId: string]: {
        [countyName: string]: DataByMonth;
      };
    };
  };
};

type DataByMonth = {
  [MonthNumber in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12]: number;
};

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

type MonthlyEmissionsAction =
  | { type: 'geography/SELECT_REGION' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | { type: 'eere/RESET_EERE_INPUTS' }
  | {
      type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS';
      payload: {
        so2: MonthlyChanges;
        nox: MonthlyChanges;
        co2: MonthlyChanges;
        pm25: MonthlyChanges;
      };
    }
  | {
      type: 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS';
      payload: { availableStates: string[] };
    }
  | {
      type: 'monthlyEmissions/SET_DOWNLOAD_DATA';
      payload: {
        so2: MonthlyChanges;
        nox: MonthlyChanges;
        co2: MonthlyChanges;
        pm25: MonthlyChanges;
        statesAndCounties: StatesAndCounties;
      };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
      payload: { aggregation: MonthlyAggregation };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT';
      payload: { unit: MonthlyUnit };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE';
      payload: {
        selectedState: string;
        availableCounties: string[];
      };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
      payload: { selectedCounty: string };
    }
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };

type MonthlyEmissionsState = {
  status: 'ready' | 'started' | 'complete';
  aggregation: MonthlyAggregation;
  unit: MonthlyUnit;
  availableStates: string[];
  availableCounties: string[];
  selectedState: string;
  selectedCounty: string;
  output: {
    so2: number[];
    nox: number[];
    co2: number[];
    pm25: number[];
  };
  downloadableCountyData: CountyDataRow[];
  downloadableCobraData: CobraDataRow[];
};

// reducer
const initialState: MonthlyEmissionsState = {
  status: 'ready',
  aggregation: 'region',
  unit: 'emissions',
  availableStates: [],
  availableCounties: [],
  selectedState: '',
  selectedCounty: '',
  output: {
    so2: [],
    nox: [],
    co2: [],
    pm25: [],
  },
  downloadableCountyData: [],
  downloadableCobraData: [],
};

export default function reducer(
  state: MonthlyEmissionsState = initialState,
  action: MonthlyEmissionsAction,
): MonthlyEmissionsState {
  switch (action.type) {
    case 'geography/SELECT_REGION':
      return initialState;

    case 'displacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
      };

    case 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS':
      return {
        ...state,
        status: 'complete',
        availableStates: action.payload.availableStates,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION':
      return {
        ...state,
        aggregation: action.payload.aggregation,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_UNIT':
      return {
        ...state,
        unit: action.payload.unit,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_STATE':
      return {
        ...state,
        selectedState: action.payload.selectedState,
        selectedCounty: '',
        availableCounties: action.payload.availableCounties,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_COUNTY':
      return {
        ...state,
        selectedCounty: action.payload.selectedCounty,
      };

    case 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS':
      const { unit, aggregation, selectedState, selectedCounty } = state;

      const emissionData: {
        [pollutant in 'so2' | 'nox' | 'co2' | 'pm25']: number[];
      } = {
        so2: [],
        nox: [],
        co2: [],
        pm25: [],
      };

      // populate emissionData with data from action (pollutant data from store)
      (Object.keys(emissionData) as ('so2' | 'nox' | 'co2' | 'pm25')[]).forEach(
        (pollutant) => {
          if (aggregation === 'region') {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][unit].region,
            );
          }

          if (aggregation === 'state' && selectedState) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][unit].state[selectedState],
            );
          }

          if (aggregation === 'county' && selectedState && selectedCounty) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][unit].county[selectedState][
                selectedCounty
              ],
            );
          }
        },
      );

      return {
        ...state,
        output: emissionData,
      };

    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS':
    case 'eere/RESET_EERE_INPUTS':
      return initialState;

    case 'monthlyEmissions/SET_DOWNLOAD_DATA':
      const countyData: CountyDataRow[] = [];
      const cobraData: CobraDataRow[] = [];

      const { so2, nox, co2, pm25, statesAndCounties } = action.payload;

      //------ region data ------
      // add county data for each polutant, unit, and region
      countyData.push(countyRow('SO2', 'emissions (pounds)', so2.emissions.region)); // prettier-ignore
      countyData.push(countyRow('NOX', 'emissions (pounds)', nox.emissions.region)); // prettier-ignore
      countyData.push(countyRow('CO2', 'emissions (tons)', co2.emissions.region)); // prettier-ignore
      countyData.push(countyRow('PM25', 'emissions (pounds)', pm25.emissions.region)); // prettier-ignore
      countyData.push(countyRow('SO2', 'percent', so2.percentages.region));
      countyData.push(countyRow('NOX', 'percent', nox.percentages.region));
      countyData.push(countyRow('CO2', 'percent', co2.percentages.region));
      countyData.push(countyRow('PM25', 'percent', pm25.percentages.region));

      //------ states data ------
      // prettier-ignore
      Object.keys(statesAndCounties).forEach((s) => {
        // add county data for each polutant, unit, and state
        countyData.push(countyRow('SO2', 'emissions (pounds)', so2.emissions.state[s], s));
        countyData.push(countyRow('NOX', 'emissions (pounds)', nox.emissions.state[s], s));
        countyData.push(countyRow('CO2', 'emissions (tons)', co2.emissions.state[s], s));
        countyData.push(countyRow('PM25', 'emissions (pounds)', pm25.emissions.state[s], s));
        countyData.push(countyRow('SO2', 'percent', so2.percentages.state[s], s));
        countyData.push(countyRow('NOX', 'percent', nox.percentages.state[s], s));
        countyData.push(countyRow('CO2', 'percent', co2.percentages.state[s], s));
        countyData.push(countyRow('PM25', 'percent', pm25.percentages.state[s], s));

        //------ counties data ------
        statesAndCounties[s].forEach((c) => {
          // add county data for each polutant, unit, and county
          countyData.push(countyRow('SO2', 'emissions (pounds)', so2.emissions.county[s][c], s, c));
          countyData.push(countyRow('NOX', 'emissions (pounds)', nox.emissions.county[s][c], s, c));
          countyData.push(countyRow('CO2', 'emissions (tons)', co2.emissions.county[s][c], s, c));
          countyData.push(countyRow('PM25', 'emissions (pounds)', pm25.emissions.county[s][c], s, c));
          countyData.push(countyRow('SO2', 'percent', so2.percentages.county[s][c], s, c));
          countyData.push(countyRow('NOX', 'percent', nox.percentages.county[s][c], s, c));
          countyData.push(countyRow('CO2', 'percent', co2.percentages.county[s][c], s, c));
          countyData.push(countyRow('PM25', 'percent', pm25.percentages.county[s][c], s, c));

          // add cobra data for each county
          cobraData.push(cobraRow(s, c, action.payload));
        });
      });

      return {
        ...state,
        downloadableCountyData: countyData,
        downloadableCobraData: cobraData,
      };

    default:
      return state;
  }
}

function renderMonthlyEmissionsCharts(): AppThunk {
  return (dispatch, getState) => {
    const { displacement } = getState();
    const { so2, nox, co2, pm25 } = displacement;

    dispatch({
      type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS',
      payload: {
        so2: so2.data.monthlyChanges,
        nox: nox.data.monthlyChanges,
        co2: co2.data.monthlyChanges,
        pm25: pm25.data.monthlyChanges,
      },
    });
  };
}

export function completeMonthlyEmissions(): AppThunk {
  return (dispatch, getState) => {
    const { displacement } = getState();
    const { statesAndCounties, so2, nox, co2, pm25 } = displacement;

    dispatch({
      type: 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS',
      payload: { availableStates: Object.keys(statesAndCounties).sort() },
    });

    dispatch({
      type: 'monthlyEmissions/SET_DOWNLOAD_DATA',
      payload: {
        so2: so2.data.monthlyChanges,
        nox: nox.data.monthlyChanges,
        co2: co2.data.monthlyChanges,
        pm25: pm25.data.monthlyChanges,
        statesAndCounties: statesAndCounties,
      },
    });

    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyAggregation(
  aggregation: MonthlyAggregation,
): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION',
      payload: { aggregation },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyUnit(unit: MonthlyUnit): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT',
      payload: { unit },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyState(stateId: string): AppThunk {
  return (dispatch, getState) => {
    const { displacement } = getState();

    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
      payload: {
        selectedState: stateId,
        availableCounties: displacement.statesAndCounties[stateId].sort(),
      },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyCounty(countyName: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
      payload: { selectedCounty: countyName },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function resetMonthlyEmissions(): MonthlyEmissionsAction {
  return { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };
}

/**
 * helper function to format downloadable county data rows
 */
function countyRow(
  pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25',
  unit: 'emissions (pounds)' | 'emissions (tons)' | 'percent',
  data: DataByMonth,
  state?: string,
  county?: string,
): CountyDataRow {
  const dataByMonth = Object.values(data);

  // format 'city' if found in county name
  const countyName = county ? county.replace(/city/, '(City)') : null;

  return {
    Pollutant: pollutant,
    'Aggregation level': county
      ? 'County'
      : state
      ? 'State'
      : 'AVERT Region(s)',
    State: state ? state : null,
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
  stateId: string,
  county: string,
  payload: {
    so2: MonthlyChanges;
    nox: MonthlyChanges;
    co2: MonthlyChanges;
    pm25: MonthlyChanges;
    statesAndCounties: StatesAndCounties;
  },
): CobraDataRow {
  /**
   * All counties in the `fipsCodes` array (which is data converted from the
   * main AVERT Excel file) have the word 'County' included at the end of
   * their county name. This is correct for actual counties, but shouldn't
   * be the case for cities, so when we match on county names, we need to
   * trim off the extra "County" string if its actually a city.
   * For example, in the `fipsCodes` array (which again, is data converted from
   * the Excel file), Baltimore city is stored as "Baltimore city County", but
   * in the RDFs it's stored as "Baltimore city"
   */
  const matchedFipsCodeItem = fipsCodes.filter((item) => {
    return (
      item['state'] === states[stateId as StateId].name &&
      item['county'].replace(/city County/, 'city') === county
    );
  })[0];

  const fipsCode = matchedFipsCodeItem ? matchedFipsCodeItem['code'] : '';

  // format 'city' if found in county name
  const countyName = county.replace(/city/, '(City)');

  const noxDataset = payload.nox.emissions.county[stateId][county];
  const so2Dataset = payload.so2.emissions.county[stateId][county];
  const pm25Dataset = payload.pm25.emissions.county[stateId][county];

  const sum = (a: number, b: number) => a + b;

  const noxDataTons = Object.values(noxDataset).reduce(sum, 0) / 2000;
  const so2DataTons = Object.values(so2Dataset).reduce(sum, 0) / 2000;
  const pm25DataTons = Object.values(pm25Dataset).reduce(sum, 0) / 2000;

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
