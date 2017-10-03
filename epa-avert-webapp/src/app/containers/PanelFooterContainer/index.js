import { connect } from 'react-redux';
// components
import PanelFooter from '../../components/PanelFooter';
// action creators
import { setActiveStep } from 'app/redux/panel';
import {
  fetchRegion,
  calculateDisplacement,
  resetEereInputs,
  resetMonthlyEmissions,
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

const PanelFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelFooter);

export default PanelFooterContainer;
