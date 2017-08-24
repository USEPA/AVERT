import { connect } from 'react-redux';
// components
import StepPanels from '../../components/StepPanels';
// action creators
import {
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
  onClickOutsideModal(activeModalId) {
    dispatch(resetActiveModal(activeModalId));
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
