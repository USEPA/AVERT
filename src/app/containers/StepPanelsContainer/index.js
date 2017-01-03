import { connect } from 'react-redux';
// components
import StepPanels from '../../components/StepPanels';
// action creators
import {
  overrideRegion,
  resetActiveModal,
  toggleModalOverlay,
  startDataDownload,
} from '../../actions';

const mapStateToProps = (state) => ({
  loading: state.panel.loading,
  modalOverlay: state.panel.modalOverlay,
  activeModalId: state.panel.activeModalId,
  percentComplete: state.panel.percentComplete,
  softValid: state.eere.soft_valid,
});

const mapDispatchToProps = (dispatch) => ({
  onClickDebug() {
    // dispatch(startDataDownload());
    dispatch(overrideRegion());
  },
  onClickOutsideModal() {
    dispatch(resetActiveModal());
    dispatch(toggleModalOverlay());
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
