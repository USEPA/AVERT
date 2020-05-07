import { useSelector, TypedUseSelectorHook } from 'react-redux';
// reducers
import { AppThunk } from 'app/redux/index';
import { DataByMonth, MonthlyChanges } from 'app/redux/shared';
// enums
import States from 'app/enums/States';
import FipsCodes from 'app/enums/FipsCodes';

export type MonthlyAggregation = 'region' | 'state' | 'county';

export type MonthlyUnit = 'emissions' | 'percentages';

type CountyDataRow = {
  Pollutant: 'SO2' | 'NOX' | 'CO2' | 'PM25';
  'Aggregation level': 'County' | 'State' | 'Region';
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
  | {
      type: 'region/SELECT_REGION';
    }
  | {
      type: 'annualDisplacement/START_DISPLACEMENT';
    }
  | {
      type: 'eere/RESET_EERE_INPUTS';
    }
  | {
      type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS';
      so2: MonthlyChanges;
      nox: MonthlyChanges;
      co2: MonthlyChanges;
      pm25: MonthlyChanges;
    }
  | {
      type: 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS';
      availableStates: string[];
    }
  | {
      type: 'monthlyEmissions/SET_DOWNLOAD_DATA';
      so2: MonthlyChanges;
      nox: MonthlyChanges;
      co2: MonthlyChanges;
      pm25: MonthlyChanges;
      statesAndCounties: {
        [stateId: string]: string[];
      };
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
      aggregation: MonthlyAggregation;
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT';
      unit: MonthlyUnit;
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE';
      selectedState: string;
      availableCounties: string[];
    }
  | {
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
      selectedCounty: string;
    }
  | {
      type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS';
    };

type MonthlyEmissionsState = {
  status: 'select_region' | 'ready' | 'started' | 'complete';
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

export const useMonthlyEmissionsState: TypedUseSelectorHook<MonthlyEmissionsState> = useSelector;

// reducer
const initialState: MonthlyEmissionsState = {
  status: 'select_region',
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
    case 'region/SELECT_REGION':
      return {
        ...state,
        status: 'ready',
      };

    case 'annualDisplacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
      };

    case 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS':
      return {
        ...state,
        status: 'complete',
        availableStates: action.availableStates,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION':
      return {
        ...state,
        aggregation: action.aggregation,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_UNIT':
      return {
        ...state,
        unit: action.unit,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_STATE':
      return {
        ...state,
        selectedState: action.selectedState,
        selectedCounty: '',
        availableCounties: action.availableCounties,
      };

    case 'monthlyEmissions/SELECT_MONTHLY_COUNTY':
      return {
        ...state,
        selectedCounty: action.selectedCounty,
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
              action[pollutant][unit].region,
            );
          }

          if (aggregation === 'state' && selectedState) {
            emissionData[pollutant] = Object.values(
              action[pollutant][unit].state[selectedState],
            );
          }

          if (aggregation === 'county' && selectedState && selectedCounty) {
            emissionData[pollutant] = Object.values(
              action[pollutant][unit].county[selectedState][selectedCounty],
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

      //------ region data ------
      // add county data for each polutant, unit, and region
      countyData.push(countyRow('SO2', 'emissions (pounds)', action.so2.emissions.region)); // prettier-ignore
      countyData.push(countyRow('NOX', 'emissions (pounds)', action.nox.emissions.region)); // prettier-ignore
      countyData.push(countyRow('CO2', 'emissions (tons)', action.co2.emissions.region)); // prettier-ignore
      countyData.push(countyRow('PM25', 'emissions (pounds)', action.pm25.emissions.region)); // prettier-ignore
      countyData.push(countyRow('SO2', 'percent', action.so2.percentages.region)); // prettier-ignore
      countyData.push(countyRow('NOX', 'percent', action.nox.percentages.region)); // prettier-ignore
      countyData.push(countyRow('CO2', 'percent', action.co2.percentages.region)); // prettier-ignore
      countyData.push(countyRow('PM25', 'percent', action.pm25.percentages.region)); // prettier-ignore

      //------ states data ------
      // prettier-ignore
      Object.keys(action.statesAndCounties).forEach((s) => {
        // add county data for each polutant, unit, and state
        countyData.push(countyRow('SO2', 'emissions (pounds)', action.so2.emissions.state[s], s));
        countyData.push(countyRow('NOX', 'emissions (pounds)', action.nox.emissions.state[s], s));
        countyData.push(countyRow('CO2', 'emissions (tons)', action.co2.emissions.state[s], s));
        countyData.push(countyRow('PM25', 'emissions (pounds)', action.pm25.emissions.state[s], s));
        countyData.push(countyRow('SO2', 'percent', action.so2.percentages.state[s], s));
        countyData.push(countyRow('NOX', 'percent', action.nox.percentages.state[s], s));
        countyData.push(countyRow('CO2', 'percent', action.co2.percentages.state[s], s));
        countyData.push(countyRow('PM25', 'percent', action.pm25.percentages.state[s], s));

        //------ counties data ------
        action.statesAndCounties[s].forEach((c) => {
          // add county data for each polutant, unit, and county
          countyData.push(countyRow('SO2', 'emissions (pounds)', action.so2.emissions.county[s][c], s, c));
          countyData.push(countyRow('NOX', 'emissions (pounds)', action.nox.emissions.county[s][c], s, c));
          countyData.push(countyRow('CO2', 'emissions (tons)', action.co2.emissions.county[s][c], s, c));
          countyData.push(countyRow('PM25', 'emissions (pounds)', action.pm25.emissions.county[s][c], s, c));
          countyData.push(countyRow('SO2', 'percent', action.so2.percentages.county[s][c], s, c));
          countyData.push(countyRow('NOX', 'percent', action.nox.percentages.county[s][c], s, c));
          countyData.push(countyRow('CO2', 'percent', action.co2.percentages.county[s][c], s, c));
          countyData.push(countyRow('PM25', 'percent', action.pm25.percentages.county[s][c], s, c));

          // add cobra data for each county
          cobraData.push(cobraRow(s, c, action));
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

export const renderMonthlyEmissionsCharts = (): AppThunk => {
  return function (dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { so2, nox, co2, pm25 } = getState();

    dispatch({
      type: 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS',
      so2: so2.data.monthlyChanges,
      nox: nox.data.monthlyChanges,
      co2: co2.data.monthlyChanges,
      pm25: pm25.data.monthlyChanges,
    });
  };
};

export const completeMonthlyEmissions = (): AppThunk => {
  return function (dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { annualDisplacement, so2, nox, co2, pm25 } = getState();

    dispatch({
      type: 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS',
      availableStates: Object.keys(annualDisplacement.statesAndCounties).sort(),
    });

    dispatch({
      type: 'monthlyEmissions/SET_DOWNLOAD_DATA',
      so2: so2.data.monthlyChanges,
      nox: nox.data.monthlyChanges,
      co2: co2.data.monthlyChanges,
      pm25: pm25.data.monthlyChanges,
      statesAndCounties: annualDisplacement.statesAndCounties,
    });

    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyAggregation = (
  selection: MonthlyAggregation,
): AppThunk => {
  return function (dispatch) {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION',
      aggregation: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyUnit = (selection: MonthlyUnit): AppThunk => {
  return function (dispatch) {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_UNIT',
      unit: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyState = (selection: string): AppThunk => {
  return function (dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { annualDisplacement } = getState();

    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_STATE',
      selectedState: selection,
      availableCounties: annualDisplacement.statesAndCounties[selection].sort(),
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyCounty = (selection: string): AppThunk => {
  return function (dispatch) {
    dispatch({
      type: 'monthlyEmissions/SELECT_MONTHLY_COUNTY',
      selectedCounty: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const resetMonthlyEmissions = (): MonthlyEmissionsAction => ({
  type: 'monthlyEmissions/RESET_MONTHLY_EMISSIONS',
});

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

  return {
    Pollutant: pollutant,
    'Aggregation level': county ? 'County' : state ? 'State' : 'Region',
    State: state ? state : null,
    County: county ? county : null,
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
  state: string,
  county: string,
  action: { nox: MonthlyChanges; so2: MonthlyChanges; pm25: MonthlyChanges },
): CobraDataRow {
  const fipsCounty = FipsCodes.filter((item) => {
    return item['state'] === States[state] && item['county'] === county;
  })[0];

  const fipsCode = fipsCounty ? fipsCounty['code'] : '';

  const countyName =
    county.indexOf('(City)') !== -1
      ? county // county is really a city
      : state === 'LA'
      ? `${county} Parish`
      : `${county} County`;

  const noxDataset = action.nox.emissions.county[state][county];
  const so2Dataset = action.so2.emissions.county[state][county];
  const pm25Dataset = action.pm25.emissions.county[state][county];

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
    STATE: States[state],
    COUNTY: countyName,
    TIER1NAME: 'FUEL COMB. ELEC. UTIL.',
    NOx_REDUCTIONS_TONS: formatNumber(noxDataTons),
    SO2_REDUCTIONS_TONS: formatNumber(so2DataTons),
    PM25_REDUCTIONS_TONS: formatNumber(pm25DataTons),
  };
}
