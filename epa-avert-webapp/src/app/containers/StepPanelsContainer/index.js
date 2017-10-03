import { connect } from 'react-redux';
// components
import StepPanels from '../../components/StepPanels';
// action creators
import { toggleModalOverlay, resetActiveModal } from 'app/redux/panel';
import { startDataDownload } from 'app/redux/dataDownload';

const mapStateToProps = (state) => ({
  loading: state.panel.loading,
  modalOverlay: state.panel.modalOverlay,
  activeModalId: state.panel.activeModalId,
  loadingProgress: state.panel.loadingProgress,
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
