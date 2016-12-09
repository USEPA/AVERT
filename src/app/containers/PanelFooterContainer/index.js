import { connect } from 'react-redux';
// components
import PanelFooter from '../../components/PanelFooter';
// action creators
import {
  setActiveStep,
  calculateDisplacement,
} from '../../actions';

const mapStateToProps = (state) => ({
  activeStep: state.panel.activeStep,
  eereStatus: state.eere.status,
  region: state.regions.region,
});

const mapDispatchToProps = (dispatch) => ({
  onSetActiveStep(stepNumber) {
    dispatch(setActiveStep(stepNumber));
  },
  onCalculateDisplacement() {
    calculateDisplacement();
  },
});

const PanelFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelFooter);

export default PanelFooterContainer;
