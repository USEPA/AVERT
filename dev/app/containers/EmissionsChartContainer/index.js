import { connect } from 'react-redux';
// components
import EmissionsChart from '../../components/EmissionsChart';
// action creators
import {
  changeSelectedAggregation,
  changeSelectedUnit
} from '../../actions';

const mapStateToProps = (state) => {
  return {
    aggregation: state.selectedAggregation,
    unit: state.selectedUnit,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAggregationRadioChange: (text) => {
      dispatch(changeSelectedAggregation(text))
    },
    onUnitRadioChange: (text) => {
      dispatch(changeSelectedUnit(text))
    },
  }
};

const EmissionsChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmissionsChart);

export default EmissionsChartContainer;
