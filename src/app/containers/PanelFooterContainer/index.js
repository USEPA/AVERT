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
  nextDisabled: state.panel.nextDisabled,
});

const mapDispatchToProps = (dispatch) => ({
  onButtonClick(stepNumber) {
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
