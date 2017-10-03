import { connect } from 'react-redux';
// components
import EmissionsChart from '../../components/EmissionsChart';
// action creators
import {
  selectMonthlyAggregation,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/actions';

const mapStateToProps = (state) => ({
  monthly_status: state.monthlyEmissions.status,
  output: state.monthlyEmissions.newVisibleData,
  aggregation: state.monthlyEmissions.newSelectedAggregation,
  unit: state.monthlyEmissions.newSelectedUnit,
  selected_region: state.regions.region,
  available_states: state.monthlyEmissions.newStates,
  available_counties: state.monthlyEmissions.newVisibleCounties,
  selected_state: state.monthlyEmissions.newSelectedState,
  selected_county: state.monthlyEmissions.newSelectedCounty,
});

const mapDispatchToProps = (dispatch) => ({
  onAggregationChange(aggregation) {
    dispatch(selectMonthlyAggregation(aggregation));
  },
  onUnitChange(unit) {
    dispatch(selectMonthlyUnit(unit));
  },
  selectState(state) {
    dispatch(selectMonthlyState(state));
  },
  selectCounty(county) {
    dispatch(selectMonthlyCounty(county));
  },
});

const EmissionsChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmissionsChart);

export default EmissionsChartContainer;
