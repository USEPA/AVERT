// action types
import { SELECT_REGION } from 'app/redux/regions';
import { START_DISPLACEMENT } from 'app/redux/annualDisplacement';
export const RENDER_MONTHLY_EMISSIONS_CHARTS = 'monthlyEmissions/RENDER_MONTHLY_EMISSIONS_CHARTS';
export const COMPLETE_MONTHLY_EMISSIONS = 'monthlyEmissions/COMPLETE_MONTHLY_EMISSIONS';
export const SET_DOWNLOAD_DATA = 'monthlyEmissions/SET_DOWNLOAD_DATA';
export const SELECT_MONTHLY_AGGREGATION = 'monthlyEmissions/SELECT_MONTHLY_AGGREGATION';
export const SELECT_MONTHLY_UNIT = 'monthlyEmissions/SELECT_MONTHLY_UNIT';
export const SELECT_MONTHLY_STATE = 'monthlyEmissions/SELECT_MONTHLY_STATE';
export const SELECT_MONTHLY_COUNTY = 'monthlyEmissions/SELECT_MONTHLY_COUNTY';
export const RESET_MONTHLY_EMISSIONS = 'monthlyEmissions/RESET_MONTHLY_EMISSIONS';

// reducer
const initialState = {
  status: 'select_region',
  aggregation: 'region',
  unit: 'emissions',
  availableStates: [],
  availableCounties: [],
  selectedState: '',
  selectedCounty: '',
  data: {},
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
        data: action.data,
        availableStates: Object.keys(action.data.statesAndCounties),
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
        selectedState: action.state,
        selectedCounty: '',
        availableCounties: action.availableCounties,
      };

    case SELECT_MONTHLY_COUNTY:
      return {
        ...state,
        selectedCounty: action.county,
      };

    case RENDER_MONTHLY_EMISSIONS_CHARTS:
      const { unit, aggregation, selectedState, selectedCounty } = state;

      const pollutants = ['so2', 'nox', 'co2', 'pm25'];

      let emissionData = {};
      if (aggregation === 'region') {
        pollutants.forEach((pollutant) => {
          emissionData[pollutant] = state.data[unit][pollutant].regional;
        });
      }
      if (aggregation === 'state' && selectedState) {
        pollutants.forEach((pollutant) => {
          emissionData[pollutant] = Object.values(
            state.data[unit][pollutant].state[selectedState]
          );
        });
      }
      if (aggregation === 'county' && selectedState && selectedCounty) {
        pollutants.forEach((pollutant) => {
          emissionData[pollutant] = Object.values(
            state.data[unit][pollutant].county[selectedState][selectedCounty]
          );
        });
      }

      return {
        ...state,
        output: emissionData,
      };

    case RESET_MONTHLY_EMISSIONS:
      return initialState;

    case SET_DOWNLOAD_DATA:
      const { emissions, percentages, statesAndCounties } = state.data;

      const structureData = (pollutant, unit, data, state, county) => {
        data = Object.values(data);
        return {
          type: pollutant,
          aggregation_level: (county) ? 'County' : ((state) ? 'State' : 'Regional'),
          state: (state) ? state : null,
          county: (county) ? county : null,
          emission_unit: unit,
          january: data[0],
          february: data[1],
          march: data[2],
          april: data[3],
          may: data[4],
          june: data[5],
          july: data[6],
          august: data[7],
          september: data[8],
          october: data[9],
          november: data[10],
          december: data[11],
        }
      };

      let rows = [];
      // region
      rows.push(structureData('SO2', 'emissions', emissions.so2.regional));
      rows.push(structureData('NOX', 'emissions', emissions.nox.regional));
      rows.push(structureData('CO2', 'emissions', emissions.co2.regional));
      rows.push(structureData('PM25', 'emissions', emissions.pm25.regional));
      rows.push(structureData('SO2', 'percentages', percentages.so2.regional));
      rows.push(structureData('NOX', 'percentages', percentages.nox.regional));
      rows.push(structureData('CO2', 'percentages', percentages.co2.regional));
      rows.push(structureData('PM25', 'percentages', percentages.pm25.regional));
      // states
      Object.keys(statesAndCounties).forEach((s) => {
        rows.push(structureData('SO2', 'emissions', emissions.so2.state[s], s));
        rows.push(structureData('NOX', 'emissions', emissions.nox.state[s], s));
        rows.push(structureData('CO2', 'emissions', emissions.co2.state[s], s));
        rows.push(structureData('PM25', 'emissions', emissions.pm25.state[s], s));
        rows.push(structureData('SO2', 'percentages', percentages.so2.state[s], s));
        rows.push(structureData('NOX', 'percentages', percentages.nox.state[s], s));
        rows.push(structureData('CO2', 'percentages', percentages.co2.state[s], s));
        rows.push(structureData('PM25', 'percentages', percentages.pm25.state[s], s));
        // counties
        statesAndCounties[s].forEach((c) => {
          rows.push(structureData('SO2', 'emissions', emissions.so2.county[s][c], s, c));
          rows.push(structureData('NOX', 'emissions', emissions.nox.county[s][c], s, c));
          rows.push(structureData('CO2', 'emissions', emissions.co2.county[s][c], s, c));
          rows.push(structureData('PM25', 'emissions', emissions.pm25.county[s][c], s, c));
          rows.push(structureData('SO2', 'percentages', percentages.so2.county[s][c], s, c));
          rows.push(structureData('NOX', 'percentages', percentages.nox.county[s][c], s, c));
          rows.push(structureData('CO2', 'percentages', percentages.co2.county[s][c], s, c));
          rows.push(structureData('PM25', 'percentages', percentages.pm25.county[s][c], s, c));
        });
      });

      return {
        ...state,
        downloadableData: rows,
      };

    default:
      return state;
  }
};

export const renderMonthlyEmissionsCharts = () => ({
  type: RENDER_MONTHLY_EMISSIONS_CHARTS,
});

export const completeMonthlyEmissions = (data) => {
  return function (dispatch) {
    dispatch({
      type: COMPLETE_MONTHLY_EMISSIONS,
      data: data,
    });
    dispatch({ type: SET_DOWNLOAD_DATA });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const selectMonthlyAggregation = (aggregation) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_AGGREGATION,
      aggregation: aggregation,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const selectMonthlyUnit = (unit) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_UNIT,
      unit: unit,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const selectMonthlyState = (state) => {
  return function (dispatch, getState) {
    const { monthlyEmissions } = getState();

    dispatch({
      type: SELECT_MONTHLY_STATE,
      state: state,
      availableCounties: monthlyEmissions.data.statesAndCounties[state],
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const selectMonthlyCounty = (county) => {
  return function (dispatch) {
    dispatch({
      type: SELECT_MONTHLY_COUNTY,
      county: county,
    });
    dispatch(renderMonthlyEmissionsCharts());
  }
};

export const resetMonthlyEmissions = () => ({
  type: RESET_MONTHLY_EMISSIONS,
});
