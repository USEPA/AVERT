import { connect } from 'react-redux';
// components
import StepPanels from './index.js';
// actions
import { toggleModalOverlay, resetActiveModal } from 'app/redux/panel';

const mapStateToProps = (state) => ({
  region: state.region.name,
  loading: state.panel.loading,
  modalOverlay: state.panel.modalOverlay,
  activeModalId: state.panel.activeModalId,
  loadingProgress: state.panel.loadingProgress,
  softValid: state.eere.softLimit.valid,
  serverCalcError: state.annualDisplacement.status === 'error',
});

const mapDispatchToProps = (dispatch) => ({
  onClickOutsideModal(activeModalId) {
    dispatch(resetActiveModal(activeModalId));
    dispatch(toggleModalOverlay());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StepPanels);
