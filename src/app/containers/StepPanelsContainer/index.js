import { connect } from 'react-redux';
// components
import StepPanels from '../../components/StepPanels';

const mapStateToProps = (state) => ({
  loading: state.panel.loading,
});

const StepPanelsContainer = connect(
  mapStateToProps,
  null
)(StepPanels);

export default StepPanelsContainer;
