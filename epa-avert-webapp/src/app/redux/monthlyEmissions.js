// action types
import { SELECT_REGION } from 'app/redux/region';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
import { RESET_EERE_INPUTS } from 'app/redux/eere';
export const RENDER_MONTHLY_EMISSIONS_CHARTS = 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS'; // prettier-ignore
export const COMPLETE_MONTHLY_EMISSIONS = 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS'; // prettier-ignore
export const SET_DOWNLOAD_DATA = 'monthlyEmissions/SET_DOWNLOAD_DATA';
export const SELECT_MONTHLY_AGGREGATION = 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION'; // prettier-ignore
export const SELECT_MONTHLY_UNIT = 'monthlyEmissions/SELECT_MONTHLY_UNIT';
export const SELECT_MONTHLY_STATE = 'monthlyEmissions/SELECT_MONTHLY_STATE';
export const SELECT_MONTHLY_COUNTY = 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
export const RESET_MONTHLY_EMISSIONS = 'monthlyEmissions/RESET_MONTHLY_EMISSIONS'; // prettier-ignore

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
  downloadableData: [],
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
      const rowData = (pollutant, unit, data, state, county) => {
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

      let rows = [];
      // region
      rows.push(rowData('SO2', 'emissions (pounds)', action.so2.emissions.region)); // prettier-ignore
      rows.push(rowData('NOX', 'emissions (pounds)', action.nox.emissions.region)); // prettier-ignore
      rows.push(rowData('CO2', 'emissions (tons)', action.co2.emissions.region)); // prettier-ignore
      rows.push(rowData('PM25', 'emissions (pounds)', action.pm25.emissions.region)); // prettier-ignore
      rows.push(rowData('SO2', 'percent', action.so2.percentages.region)); // prettier-ignore
      rows.push(rowData('NOX', 'percent', action.nox.percentages.region)); // prettier-ignore
      rows.push(rowData('CO2', 'percent', action.co2.percentages.region)); // prettier-ignore
      rows.push(rowData('PM25', 'percent', action.pm25.percentages.region)); // prettier-ignore
      // states
      Object.keys(action.statesAndCounties).forEach((s) => {
        rows.push(rowData('SO2', 'emissions (pounds)', action.so2.emissions.state[s], s)); // prettier-ignore
        rows.push(rowData('NOX', 'emissions (pounds)', action.nox.emissions.state[s], s)); // prettier-ignore
        rows.push(rowData('CO2', 'emissions (tons)', action.co2.emissions.state[s], s)); // prettier-ignore
        rows.push(rowData('PM25', 'emissions (pounds)', action.pm25.emissions.state[s], s)); // prettier-ignore
        rows.push(rowData('SO2', 'percent', action.so2.percentages.state[s], s)); // prettier-ignore
        rows.push(rowData('NOX', 'percent', action.nox.percentages.state[s], s)); // prettier-ignore
        rows.push(rowData('CO2', 'percent', action.co2.percentages.state[s], s)); // prettier-ignore
        rows.push(rowData('PM25', 'percent', action.pm25.percentages.state[s], s)); // prettier-ignore
        // counties
        action.statesAndCounties[s].forEach((c) => {
          rows.push(rowData('SO2', 'emissions (pounds)', action.so2.emissions.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('NOX', 'emissions (pounds)', action.nox.emissions.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('CO2', 'emissions (tons)', action.co2.emissions.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('PM25', 'emissions (pounds)', action.pm25.emissions.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('SO2', 'percent', action.so2.percentages.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('NOX', 'percent', action.nox.percentages.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('CO2', 'percent', action.co2.percentages.county[s][c], s, c)); // prettier-ignore
          rows.push(rowData('PM25', 'percent', action.pm25.percentages.county[s][c], s, c)); // prettier-ignore
        });
      });

      return {
        ...state,
        downloadableData: rows,
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
