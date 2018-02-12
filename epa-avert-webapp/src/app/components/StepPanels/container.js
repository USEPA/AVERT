import { connect } from 'react-redux';
// components
import StepPanels from './index.js';
// actions
import { toggleModalOverlay, resetActiveModal } from 'app/redux/panel';
import { startDataDownload } from 'app/redux/dataDownload';

const mapStateToProps = (state) => ({
  loading: state.panel.loading,
  modalOverlay: state.panel.modalOverlay,
  activeModalId: state.panel.activeModalId,
  loadingProgress: state.panel.loadingProgress,
  softValid: state.eere.softValid,
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

export default connect(mapStateToProps, mapDispatchToProps)(StepPanels);
