import { connect } from 'react-redux';
// components
import PanelFooter from './index.js';
// actions
import { setActiveStep } from 'app/redux/panel';
import { fetchRegion } from 'app/redux/rdfs';
import { resetEereInputs} from 'app/redux/eere';
import { resetMonthlyEmissions } from 'app/redux/monthlyEmissions';
import {
  calculateDisplacement,
} from 'app/actions';

const mapStateToProps = (state) => ({
  activeStep: state.panel.activeStep,
  region: state.regions.region,
  eereStatus: state.eere.status,
  hardValid: state.eere.hard_valid,
});

const mapDispatchToProps = (dispatch) => ({
  onSetActiveStep(stepNumber) {
    dispatch(setActiveStep(stepNumber));
  },
  onFetchRegion() {
    dispatch(fetchRegion());
  },
  onCalculateDisplacement() {
    dispatch(calculateDisplacement());
  },
  onResetEereInputs() {
    dispatch(resetEereInputs());
  },
  onResetMonthlyEmissions() {
    dispatch(resetMonthlyEmissions());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelFooter);
