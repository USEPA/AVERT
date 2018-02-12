import { connect } from 'react-redux';
// components
import EEREInputs from './index.js';
// actions
import {
  updateEereAnnualGwh,
  updateEereConstantMw,
  updateEereBroadBasedProgram,
  updateEereReduction,
  updateEereTopHours,
  updateEereWindCapacity,
  updateEereUtilitySolar,
  updateEereRooftopSolar,
  calculateEereProfile,
} from 'app/redux/eere';

const mapStateToProps = (state) => ({
  status: state.eere.status,
  limits: state.eere.limits,
  errors: state.eere.errors,
  valid: state.eere.valid,
  constantMwh: state.eere.inputs.constantMwh,
  annualGwh: state.eere.inputs.annualGwh,
  broadProgram: state.eere.inputs.broadProgram,
  reduction: state.eere.inputs.reduction,
  topHours: state.eere.inputs.topHours,
  windCapacity: state.eere.inputs.windCapacity,
  utilitySolar: state.eere.inputs.utilitySolar,
  rooftopSolar: state.eere.inputs.rooftopSolar,
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
    dispatch(calculateEereProfile());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EEREInputs);
