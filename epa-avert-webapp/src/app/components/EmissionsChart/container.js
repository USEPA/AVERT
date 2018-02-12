import { connect } from 'react-redux';
// components
import EmissionsChart from './index.js';
// actions
import {
  selectMonthlyAggregation,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/redux/monthlyEmissions';

const mapStateToProps = (state) => ({
  selectedRegionId: state.regions.region,
  monthlyStatus: state.monthlyEmissions.status,
  aggregation: state.monthlyEmissions.aggregation,
  unit: state.monthlyEmissions.unit,
  availableStates: state.monthlyEmissions.availableStates,
  availableCounties: state.monthlyEmissions.availableCounties,
  selectedState: state.monthlyEmissions.selectedState,
  selectedCounty: state.monthlyEmissions.selectedCounty,
  output: state.monthlyEmissions.output,
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

export default connect(mapStateToProps, mapDispatchToProps)(EmissionsChart);
