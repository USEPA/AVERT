// actions
import {
  SELECT_REGION,
  START_DISPLACEMENT,
  COMPLETE_MONTHLY_EMISSIONS,
  SELECT_MONTHLY_AGGREGATION,
  SELECT_MONTHLY_UNIT,
  SELECT_MONTHLY_STATE,
  SELECT_MONTHLY_COUNTY,
  RENDER_MONTHLY_EMISSIONS_CHARTS,
  RESET_MONTHLY_EMISSIONS,
  SET_DOWNLOAD_DATA,
} from 'app/actions';

// utility function for structuring data for download file
const setStructure = (type, emissionsOrPercentages, data, state, county) => {
  data = Object.values(data);
  return {
    type: type,
    aggregation_level: county ? 'County' : (state ? 'State' : 'Regional'),
    state: state ? state : null,
    county: county ? county : null,
    emission_unit: emissionsOrPercentages,
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

// reducer
const initialState = {
  status: 'select_region',
  selectedAggregation: 'region',
  selectedState: '',
  selectedCounty: '',
  selectedUnit: 'emission',
  rawData: {},
  emissionsRegionSo2: [],
  emissionsRegionNox: [],
  emissionsRegionCo2: [],
  emissionsRegionPm25: [],
  emissionsStatesSo2: {},
  emissionsStatesNox: {},
  emissionsStatesCo2: {},
  emissionsStatesPm25: {},
  emissionsCountiesSo2: {},
  emissionsCountiesNox: {},
  emissionsCountiesCo2: {},
  emissionsCountiesPm25: {},
  percentagesRegionSo2: [],
  percentagesRegionNox: [],
  percentagesRegionCo2: [],
  percentagesRegionPm25: [],
  percentagesStatesSo2: {},
  percentagesStatesNox: {},
  percentagesStatesCo2: {},
  percentagesStatesPm25: {},
  percentagesCountiesSo2: {},
  percentagesCountiesNox: {},
  percentagesCountiesCo2: {},
  percentagesCountiesPm25: {},
  states: [],
  counties: {},
  visibleCounties: [],
  visibleData: {
    so2: [], nox: [], co2: [], pm25: [],
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
        rawData: action.data,
        emissionsRegionSo2: action.data.emissions.so2.regional,
        emissionsRegionNox: action.data.emissions.nox.regional,
        emissionsRegionCo2: action.data.emissions.co2.regional,
        emissionsRegionPm25: action.data.emissions.pm25.regional,
        emissionsStatesSo2: action.data.emissions.so2.state,
        emissionsStatesNox: action.data.emissions.nox.state,
        emissionsStatesCo2: action.data.emissions.co2.state,
        emissionsStatesPm25: action.data.emissions.pm25.state,
        emissionsCountiesSo2: action.data.emissions.so2.county,
        emissionsCountiesNox: action.data.emissions.nox.county,
        emissionsCountiesCo2: action.data.emissions.co2.county,
        emissionsCountiesPm25: action.data.emissions.pm25.county,
        percentagesRegionSo2: action.data.percentages.so2.regional,
        percentagesRegionNox: action.data.percentages.nox.regional,
        percentagesRegionCo2: action.data.percentages.co2.regional,
        percentagesRegionPm25: action.data.percentages.pm25.regional,
        percentagesStatesSo2: action.data.percentages.so2.state,
        percentagesStatesNox: action.data.percentages.nox.state,
        percentagesStatesCo2: action.data.percentages.co2.state,
        percentagesStatesPm25: action.data.percentages.pm25.state,
        percentagesCountiesSo2: action.data.percentages.so2.county,
        percentagesCountiesNox: action.data.percentages.nox.county,
        percentagesCountiesCo2: action.data.percentages.co2.county,
        percentagesCountiesPm25: action.data.percentages.pm25.county,
        states: Object.keys(action.data.statesAndCounties),
        counties: action.data.statesAndCounties,
      };

    case SELECT_MONTHLY_AGGREGATION:
      return {
        ...state,
        selectedAggregation: action.aggregation,
      };

    case SELECT_MONTHLY_UNIT:
      return {
        ...state,
        selectedUnit: action.unit,
      };

    case SELECT_MONTHLY_STATE:
      return {
        ...state,
        selectedState: action.state,
        selectedCounty: '',
        visibleCounties: action.visibleCounties,
      };

    case SELECT_MONTHLY_COUNTY:
      return {
        ...state,
        selectedCounty: action.county,
      };

    case RENDER_MONTHLY_EMISSIONS_CHARTS:
      const { selectedUnit, selectedAggregation, selectedState, selectedCounty } = state;

      const pollutants = ['So2', 'Nox', 'Co2', 'Pm25'];
      const unit = (selectedUnit === 'percent') ? 'percentages' : 'emissions';

      let emissionData = {};
      if (selectedAggregation === 'region') {
        pollutants.forEach((p) => {
          emissionData[p.toLowerCase()] = Object.values(
            state[`${unit}Region${p}`]
          );
        });
      }
      if (selectedAggregation === 'state' && selectedState) {
        pollutants.forEach((p) => {
          emissionData[p.toLowerCase()] = Object.values(
            state[`${unit}States${p}`][selectedState]
          );
        });
      }
      if (selectedAggregation === 'county' && selectedState && selectedCounty) {
        pollutants.forEach((p) => {
          emissionData[p.toLowerCase()] = Object.values(
            state[`${unit}Counties${p}`][selectedState][selectedCounty]
          );
        });
      }

      return {
        ...state,
        visibleData: emissionData,
      };

    case RESET_MONTHLY_EMISSIONS:
      return initialState;

    case SET_DOWNLOAD_DATA:
      let dl = [];
      dl.push(setStructure('SO2', 'emissions', state.emissionsRegionSo2));
      dl.push(setStructure('NOX', 'emissions', state.emissionsRegionNox));
      dl.push(setStructure('CO2', 'emissions', state.emissionsRegionCo2));
      dl.push(setStructure('PM25', 'emissions', state.emissionsRegionPm25));
      dl.push(setStructure('SO2', 'percentages', state.percentagesRegionSo2));
      dl.push(setStructure('NOX', 'percentages', state.percentagesRegionNox));
      dl.push(setStructure('CO2', 'percentages', state.percentagesRegionCo2));
      dl.push(setStructure('PM25', 'percentages', state.percentagesRegionPm25));

      state.states.forEach((s) => {
        dl.push(setStructure('SO2', 'emissions', state.emissionsStatesSo2[s], s));
        dl.push(setStructure('NOX', 'emissions', state.emissionsStatesNox[s], s));
        dl.push(setStructure('CO2', 'emissions', state.emissionsStatesCo2[s], s));
        dl.push(setStructure('PM25', 'emissions', state.emissionsStatesPm25[s], s));
        dl.push(setStructure('SO2', 'percentages', state.percentagesStatesSo2[s], s));
        dl.push(setStructure('NOX', 'percentages', state.percentagesStatesNox[s], s));
        dl.push(setStructure('CO2', 'percentages', state.percentagesStatesCo2[s], s));
        dl.push(setStructure('PM25', 'percentages', state.percentagesStatesPm25[s], s));

        state.counties[s].forEach((c) => {
          dl.push(setStructure('SO2', 'emissions', state.emissionsCountiesSo2[s][c], s, c));
          dl.push(setStructure('NOX', 'emissions', state.emissionsCountiesNox[s][c], s, c));
          dl.push(setStructure('CO2', 'emissions', state.emissionsCountiesCo2[s][c], s, c));
          dl.push(setStructure('PM25', 'emissions', state.emissionsCountiesPm25[s][c], s, c));
          dl.push(setStructure('SO2', 'percentages', state.percentagesCountiesSo2[s][c], s, c));
          dl.push(setStructure('NOX', 'percentages', state.percentagesCountiesNox[s][c], s, c));
          dl.push(setStructure('CO2', 'percentages', state.percentagesCountiesCo2[s][c], s, c));
          dl.push(setStructure('PM25', 'percentages', state.percentagesCountiesPm25[s][c], s, c));
        });
      });

      return {
        ...state,
        downloadableData: dl,
      };

    default:
      return state;
  }
};
