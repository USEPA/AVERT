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
  limits: state.eere.limits,
  errors: state.eere.errors,
  valid: state.eere.valid,
  constantMwh: state.eere.constantMwh,
  annualGwh: state.eere.annualGwh,
  broadProgram: state.eere.broadProgram,
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
