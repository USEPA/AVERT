import { connect } from 'react-redux';
// components
import Tooltip from '../../components/Tooltip';
// action creators
import { toggleModalOverlay } from '../../actions';

const mapDispatchToProps = (dispatch) => ({
  onClickModal() {
    dispatch(toggleModalOverlay());
  },
});

const TooltipContainer = connect(
  null,
  mapDispatchToProps
)(Tooltip);

export default TooltipContainer;
