import { connect } from 'react-redux';
// components
import Tooltip from '../../components/Tooltip';
// action creators
import {
  storeActiveModal,
  resetActiveModal,
  toggleModalOverlay
} from '../../actions';

const mapStateToProps = (state) => ({
  activeModalId: state.panel.activeModalId,
});

const mapDispatchToProps = (dispatch) => ({
  onStoreActiveModal(activeModalId) {
    dispatch(storeActiveModal(activeModalId));
  },
  onResetActiveModal() {
    dispatch(resetActiveModal());
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
