import { connect } from 'react-redux';
// components
import PanelFooter from '../../components/PanelFooter';
// action creators
import { setActiveStep } from '../../actions';

const mapStateToProps = (state) => ({
  activeStep: state.activeStep,
});

const mapDispatchToProps = (dispatch) => ({
  onButtonClick(stepNumber) {
    dispatch(setActiveStep(stepNumber))
  },
});

const PanelFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelFooter);

export default PanelFooterContainer;