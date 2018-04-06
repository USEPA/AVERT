// enums
import States from 'app/enums/States';
import FipsCodes from 'app/enums/FipsCodes';
// action types
import { SELECT_REGION } from 'app/redux/region';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
import { RESET_EERE_INPUTS } from 'app/redux/eere';
export const RENDER_MONTHLY_EMISSIONS_CHARTS =
  'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS';
export const COMPLETE_MONTHLY_EMISSIONS =
  'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS';
export const SET_DOWNLOAD_DATA = 'monthlyEmissions/SET_DOWNLOAD_DATA';
export const SELECT_MONTHLY_AGGREGATION =
  'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
export const SELECT_MONTHLY_UNIT = 'monthlyEmissions/SELECT_MONTHLY_UNIT';
export const SELECT_MONTHLY_STATE = 'monthlyEmissions/SELECT_MONTHLY_STATE';
export const SELECT_MONTHLY_COUNTY = 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
export const RESET_MONTHLY_EMISSIONS =
  'monthlyEmissions/RESET_MONTHLY_EMISSIONS';

// reducer
const initialState = {
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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_REGION:
      return {
        ...state,
        status: 'ready',
      };

    case START_DISPLACEMENT:
      return {
        ...state,
        status: 'started',
      };

    case COMPLETE_MONTHLY_EMISSIONS:
      return {
        ...state,
        status: 'complete',
        availableStates: action.availableStates,
      };

    case SELECT_MONTHLY_AGGREGATION:
      return {
        ...state,
        aggregation: action.aggregation,
      };

    case SELECT_MONTHLY_UNIT:
      return {
        ...state,
        unit: action.unit,
      };

    case SELECT_MONTHLY_STATE:
      return {
        ...state,
        selectedState: action.selectedState,
        selectedCounty: '',
        availableCounties: action.availableCounties,
      };

    case SELECT_MONTHLY_COUNTY:
      return {
        ...state,
        selectedCounty: action.selectedCounty,
      };

    case RENDER_MONTHLY_EMISSIONS_CHARTS:
      const { unit, aggregation, selectedState, selectedCounty } = state;

      const emissionData = {
        so2: [],
        nox: [],
        co2: [],
        pm25: [],
      };

      // populate emissionData with data from action (pollutant data from store)
      for (const pollutant in emissionData) {
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
      }

      return {
        ...state,
        output: emissionData,
      };

    case RESET_MONTHLY_EMISSIONS:
    case RESET_EERE_INPUTS:
      return initialState;

    case SET_DOWNLOAD_DATA:
      // helper function to format county data rows
      const countyRow = (pollutant, unit, data, state, county) => {
        data = Object.values(data);

        return {
          Pollutant: pollutant,
          'Aggregation level': county ? 'County' : state ? 'State' : 'Region',
          State: state ? state : null,
          County: county ? county : null,
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
        };
      };

      // helper function to format cobra data rows
      const cobraRow = (state, county, action) => {
        const fipsCounty = FipsCodes.filter((item) => {
          return item['state'] === States[state] && item['county'] === county;
        })[0];

        const fipsCode = fipsCounty ? fipsCounty['code'] : '';

        const sum = (a, b) => a + b;

        // prettier-ignore
        const noxData = Object.values(
          action.nox.emissions.county[state][county],
        ).reduce(sum, 0) / 2000; // convert pounds to tons
        // prettier-ignore
        const so2Data = Object.values(
          action.so2.emissions.county[state][county],
        ).reduce(sum, 0) / 2000; // convert pounds to tons
        // prettier-ignore
        const pm25Data = Object.values(
          action.pm25.emissions.county[state][county],
        ).reduce(sum, 0) /2000; // convert pounds to tons

        const countyName =
          county.indexOf('(City)') !== -1
            ? county // county is really a city
            : state === 'LA' ? `${county} Parish` : `${county} County`;

        const formatNumber = (number) =>
          number.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
          });

        return {
          FIPS: fipsCode,
          STATE: States[state],
          COUNTY: countyName,
          TIER1NAME: 'FUEL COMB. ELEC. UTIL.',
          NOx_REDUCTIONS_TONS: formatNumber(noxData),
          SO2_REDUCTIONS_TONS: formatNumber(so2Data),
          PM25_REDUCTIONS_TONS: formatNumber(pm25Data),
        };
      };

      let countyData = [];
      let cobraData = [];

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

export const renderMonthlyEmissionsCharts = () => {
  return function(dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { so2, nox, co2, pm25 } = getState();

    dispatch({
      type: RENDER_MONTHLY_EMISSIONS_CHARTS,
      so2: so2.data.monthlyChanges,
      nox: nox.data.monthlyChanges,
      co2: co2.data.monthlyChanges,
      pm25: pm25.data.monthlyChanges,
    });
  };
};

export const completeMonthlyEmissions = () => {
  return function(dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { annualDisplacement, so2, nox, co2, pm25 } = getState();

    dispatch({
      type: COMPLETE_MONTHLY_EMISSIONS,
      availableStates: Object.keys(annualDisplacement.statesAndCounties).sort(),
    });

    dispatch({
      type: SET_DOWNLOAD_DATA,
      so2: so2.data.monthlyChanges,
      nox: nox.data.monthlyChanges,
      co2: co2.data.monthlyChanges,
      pm25: pm25.data.monthlyChanges,
      statesAndCounties: annualDisplacement.statesAndCounties,
    });

    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyAggregation = (selection) => {
  return function(dispatch) {
    dispatch({
      type: SELECT_MONTHLY_AGGREGATION,
      aggregation: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyUnit = (selection) => {
  return function(dispatch) {
    dispatch({
      type: SELECT_MONTHLY_UNIT,
      unit: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyState = (selection) => {
  return function(dispatch, getState) {
    // get reducer data from store to use in dispatched action
    const { annualDisplacement } = getState();

    dispatch({
      type: SELECT_MONTHLY_STATE,
      selectedState: selection,
      availableCounties: annualDisplacement.statesAndCounties[selection].sort(),
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const selectMonthlyCounty = (selection) => {
  return function(dispatch) {
    dispatch({
      type: SELECT_MONTHLY_COUNTY,
      selectedCounty: selection,
    });
    dispatch(renderMonthlyEmissionsCharts());
  };
};

export const resetMonthlyEmissions = () => ({
  type: RESET_MONTHLY_EMISSIONS,
});
