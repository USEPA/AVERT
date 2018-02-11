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
  monthlyStatus: state.monthlyEmissions.status,
  output: state.monthlyEmissions.visibleData,
  aggregation: state.monthlyEmissions.selectedAggregation,
  unit: state.monthlyEmissions.selectedUnit,
  selectedRegionId: state.regions.region,
  availableStates: state.monthlyEmissions.states,
  availableCounties: state.monthlyEmissions.visibleCounties,
  selectedState: state.monthlyEmissions.selectedState,
  selectedCounty: state.monthlyEmissions.selectedCounty,
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
