import { connect } from 'react-redux';
// components
import EmissionsChart from '../../components/EmissionsChart';
// action creators
import {
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
  output: state.monthlyEmissions.newVisibleData,
  aggregation: state.monthlyEmissions.newSelectedAggregation,
  unit: state.monthlyEmissions.newSelectedUnit,
  selected_region: state.monthlyEmissions.regional,
  available_states: state.monthlyEmissions.newStates,
  available_counties: state.monthlyEmissions.newVisibleCounties,
  selected_state: state.monthlyEmissions.newSelectedState,
  selected_county: state.monthlyEmissions.newSelectedCounty,
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
