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
  output: state.monthlyEmissions.visibleData,
  aggregation: state.monthlyEmissions.selectedAggregation,
  unit: state.monthlyEmissions.selectedUnit,
  selected_region: state.regions.region,
  available_states: state.monthlyEmissions.states,
  available_counties: state.monthlyEmissions.visibleCounties,
  selected_state: state.monthlyEmissions.selectedState,
  selected_county: state.monthlyEmissions.selectedCounty,
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
