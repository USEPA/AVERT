import { connect } from 'react-redux';
// components
import EEREInputs from '../../components/EEREInputs';
// action creators
import {
  updateEereConstantMw,
  updateEereAnnualGwh,
  updateEereBroadBasedProgram,
  updateEereReduction,
  updateEereTopHours,
  updateEereWindCapacity,
  updateEereUtilitySolar,
  updateEereRooftopSolar,

  calculateEereProfile,
} from '../../actions';

const mapStateToProps = (state) => ({
  limits: state.eere.limits,
  errors: state.eere.errors,
  valid: state.eere.valid,

  constantMw: state.eere.constantMw,
  annualGwh: state.eere.annualGwh,
  broadProgram: state.eere.broadProgram,
  reduction: state.eere.reduction,
  topHours: state.eere.topHours,
  windCapacity: state.eere.windCapacity,
  utilitySolar: state.eere.utilitySolar,
  rooftopSolar: state.eere.rooftopSolar,

  broadProgramDisabled: state.eere.broadProgramDisabled,
  targetedProgramDisabled: state.eere.targetedProgramDisabled,

  eereStatus: state.eere.status,
});

const mapDispatchToProps = (dispatch) => ({
  onConstantMwChange(text) {
    dispatch(updateEereConstantMw(text));
  },
  onAnnualGwhChange(text) {
    dispatch(updateEereAnnualGwh(text));
  },
  onBroadBasedProgramChange(text) {
    dispatch(updateEereBroadBasedProgram(text));
  },
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
