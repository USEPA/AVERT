import { connect } from 'react-redux';
// components
import Tooltip from './index.js';
// actions
import {
  toggleModalOverlay,
  storeActiveModal,
  resetActiveModal,
} from 'app/redux/panel';

const mapStateToProps = (state) => ({
  activeModalId: state.panel.activeModalId,
  closingModalId: state.panel.closingModalId,
});

const mapDispatchToProps = (dispatch) => ({
  onStoreActiveModal(activeModalId) {
    dispatch(storeActiveModal(activeModalId));
  },
  onResetActiveModal(activeModalId) {
    dispatch(resetActiveModal(activeModalId));
  },
  onToggleModalOverlay() {
    dispatch(toggleModalOverlay());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip);
