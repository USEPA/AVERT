import { connect } from 'react-redux';
// components
import Tooltip from '../../components/Tooltip';
// action creators
import { toggleModalOverlay, storeActiveModal, resetActiveModal } from 'app/redux/panel';

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

const TooltipContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tooltip);

export default TooltipContainer;
