import { connect } from 'react-redux';
// components
import StepPanels from '../../components/StepPanels';
// action creators
import {
  overrideRegion,
  startDataDownload,
} from '../../actions';

const mapStateToProps = (state) => ({
  loading: state.panel.loading,
  percentComplete: state.panel.percentComplete,
  softValid: state.eere.soft_valid,
});

const mapDispatchToProps = (dispatch) => ({
  onClickDebug() {
    // dispatch(startDataDownload());
    dispatch(overrideRegion());
  },
  onClickDataDownload() {
    dispatch(startDataDownload());
  },
});

const StepPanelsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StepPanels);

export default StepPanelsContainer;
