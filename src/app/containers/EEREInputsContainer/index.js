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

  calculateEereProfile
} from '../../actions';

const mapStateToProps = (state) => ({
  errors: state.eere.errors,
  valid: state.eere.valid,

  constantMw: state.eere.constantMw,
  annualGwh: state.eere.annualGwh,
  //___?___: state.eere.___?___,
  reduction: state.eere.reduction,
  topHours: state.eere.topHours,
  windCapacity: state.eere.windCapacity,
  utilitySolar: state.eere.utilitySolar,
  rooftopSolar: state.eere.rooftopSolar,

  eereStatus: state.eere.status,
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
  onCalculateProfile() {
    calculateEereProfile();
  },
});

const EEREInputsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EEREInputs);

export default EEREInputsContainer;
