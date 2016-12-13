import { connect } from 'react-redux';
// components
import EmissionsChart from '../../components/EmissionsChart';
// action creators
import {
  // changeSelectedAggregation,
  // changeSelectedUnit,
  updateMonthlyAggregation,
  updateMonthlyUnit,
  reselectRegion,
  selectState,
  selectCounty,
} from '../../actions';

const mapStateToProps = (state) => ({
  // aggregation: state.selectedAggregation,
  // unit: state.selectedUnit,
  monthly_status: state.monthlyEmissions.status,
  output: state.monthlyEmissions.output,
  aggregation: state.monthlyEmissions.selected_aggregation,
  unit: state.monthlyEmissions.selected_unit,
  selected_region: state.monthlyEmissions.regional,
  available_states: state.monthlyEmissions.available_states,
  available_counties: state.monthlyEmissions.available_counties,
  selected_state: state.monthlyEmissions.selected_state,
  selected_county: state.monthlyEmissions.selected_county,
});

const mapDispatchToProps = (dispatch) => ({
  // onAggregationRadioChange(text) {
  //   dispatch(changeSelectedAggregation(text))
  // },
  // onUnitRadioChange(text) {
  //   dispatch(changeSelectedUnit(text))
  // },
  onAggregationChange(aggregation) {
    dispatch(updateMonthlyAggregation(aggregation));
  },
  onUnitChange(unit) {
    dispatch(updateMonthlyUnit(unit));
  },
  reselectRegion(region) {
    dispatch(reselectRegion(region));
  },
  selectState(state) {
    dispatch(selectState(state));
  },
  selectCounty(county) {
    dispatch(selectCounty(county));
  },
});

const EmissionsChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmissionsChart);

export default EmissionsChartContainer;
