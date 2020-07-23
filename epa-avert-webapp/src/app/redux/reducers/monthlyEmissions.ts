// reducers
import { AppThunk } from 'app/redux/index';
// config
import { StateId, states, fipsCodes } from 'app/config';

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

export type MonthlyChanges = {
  emissions: {
    region: DataByMonth;
    state: { [stateId: string]: DataByMonth };
    county: { [stateId: string]: { [countyName: string]: DataByMonth } };
  };
  percentages: {
    region: DataByMonth;
    state: { [stateId: string]: DataByMonth };
    county: { [stateId: string]: { [countyName: string]: DataByMonth } };
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

type StatesAndCounties = Partial<{ [key in StateId]: string[] }>;

type MonthlyEmissionsAction =
  | { type: 'geography/SELECT_REGION' }
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
      payload: { selectedStateId: string };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
      payload: { selectedCountyName: string };
    }
  | { type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS' };

type MonthlyEmissionsState = {
  aggregation: MonthlyAggregation;
  unit: MonthlyUnit;
  selectedStateId: string;
  selectedCountyName: string;
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
  aggregation: 'region',
  unit: 'emissions',
  selectedStateId: '',
  selectedCountyName: '',
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
    case 'geography/SELECT_REGION': {
      return initialState;
    }

    case 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION': {
      const { aggregation } = action.payload;

      return {
        ...state,
        aggregation,
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_UNIT': {
      const { unit } = action.payload;

      return {
        ...state,
        unit,
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_STATE': {
      const { selectedStateId } = action.payload;

      return {
        ...state,
        selectedStateId,
        selectedCountyName: '',
      };
    }

    case 'monthlyEmissions/SELECT_MONTHLY_COUNTY': {
      const { selectedCountyName } = action.payload;

      return {
        ...state,
        selectedCountyName,
      };
    }

    case 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS': {
      const { unit, aggregation, selectedStateId, selectedCountyName } = state;

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

          if (aggregation === 'state' && selectedStateId) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][unit].state[selectedStateId],
            );
          }

          if (
            aggregation === 'county' &&
            selectedStateId &&
            selectedCountyName
          ) {
            emissionData[pollutant] = Object.values(
              action.payload[pollutant][unit].county[selectedStateId][
                selectedCountyName
              ],
            );
          }
        },
      );

      return {
        ...state,
        output: emissionData,
      };
    }

    case 'monthlyEmissions/RESET_MONTHLY_EMISSIONS':
    case 'eere/RESET_EERE_INPUTS': {
      return initialState;
    }

    case 'monthlyEmissions/SET_DOWNLOAD_DATA': {
      const { so2, nox, co2, pm25, statesAndCounties } = action.payload;

      const countyData: CountyDataRow[] = [];
      const cobraData: CobraDataRow[] = [];

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
      (Object.keys(statesAndCounties) as StateId[]).forEach((s) => {
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
        statesAndCounties[s]?.forEach((c) => {
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
    }

    default: {
      return state;
    }
  }
}

function renderMonthlyEmissionsCharts(): AppThunk {
  return (dispatch, getState) => {
    // const { displacement } = getState();
    // const { so2, nox, co2, pm25 } = displacement;
    // dispatch({
    //   type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS',
    //   payload: {
    //     so2: so2.data.monthlyChanges,
    //     nox: nox.data.monthlyChanges,
    //     co2: co2.data.monthlyChanges,
    //     pm25: pm25.data.monthlyChanges,
    //   },
    // });
  };
}

export function completeMonthlyEmissions(): AppThunk {
  return (dispatch, getState) => {
    // const { displacement } = getState();
    // const { statesAndCounties, so2, nox, co2, pm25 } = displacement;

    // dispatch({
    //   type: 'monthlyEmissions/SET_DOWNLOAD_DATA',
    //   payload: {
    //     so2: so2.data.monthlyChanges,
    //     nox: nox.data.monthlyChanges,
    //     co2: co2.data.monthlyChanges,
    //     pm25: pm25.data.monthlyChanges,
    //     statesAndCounties: statesAndCounties,
    //   },
    // });

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
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
      payload: { selectedStateId: stateId },
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
}

export function selectMonthlyCounty(countyName: string): AppThunk {
  return (dispatch) => {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
      payload: { selectedCountyName: countyName },
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
  payload: {
    so2: MonthlyChanges;
    nox: MonthlyChanges;
    co2: MonthlyChanges;
    pm25: MonthlyChanges;
    statesAndCounties: StatesAndCounties;
  },
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
