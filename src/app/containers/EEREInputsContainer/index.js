import { connect } from 'react-redux';
// components
import EEREInputs from '../../components/EEREInputs';
// action creators
import {
  updateEereConstantMw,
  updateEereAnnualGwh,
  //update___?___,
  updateEereReduction,
  updateEereTopHours,
  updateEereWindCapacity,
  updateEereUtilitySolar,
  updateEereRooftopSolar,
} from '../../actions';

const mapStateToProps = (state) => ({
  errors: state.eere.errors,
  valid: state.eere.valid,
  softValid: state.eere.soft_valid,
  softExceedances: state.eere.soft_exceedances,
  softTopExceedanceValue: state.eere.soft_top_exceedance_value,
  softTopExceedanceHour: state.eere.soft_top_exceedance_hour,
  hardValid: state.eere.hard_valid,
  hardExceedances: state.eere.hard_exceedances,
  hardTopExceedanceValue: state.eere.hard_top_exceedance_value,
  hardTopExceedanceHour: state.eere.hard_top_exceedance_hour,

  constantMw: state.eere.constantMw,
  annualGwh: state.eere.annualGwh,
  //___?___: state.eere.___?___,
  reduction: state.eere.reduction,
  topHours: state.eere.topHours,
  windCapacity: state.eere.windCapacity,
  utilitySolar: state.eere.utilitySolar,
  rooftopSolar: state.eere.rooftopSolar,
});

const mapDispatchToProps = (dispatch) => ({
  onConstantMwChange(text) {
    dispatch(updateEereConstantMw(text));
  },
  onAnnualGwhChange(text) {
    dispatch(updateEereAnnualGwh(text));
  },
  // on___?___Change(text) {
  //   dispatch(update___?___(text));
  // },
  onReductionChange(text) {
    dispatch(updateEereReduction(text));
  },
  onTopHoursChange(text) {
    dispatch(updateEereTopHours(text));
  },
  onWindCapacityChange(text) {
    dispatch(updateEereWindCapacity(text));
  },
  onUtilitySolarChange(text) {
    dispatch(updateEereUtilitySolar(text));
  },
  onRooftopSolarChange(text) {
    dispatch(updateEereRooftopSolar(text));
  },
});

const EEREInputsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EEREInputs);

export default EEREInputsContainer;
