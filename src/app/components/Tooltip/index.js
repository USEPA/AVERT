import React, { PropTypes } from 'react';
// styles
import './styles.css';

const Tooltip = (props) => {
  const activeState = props.activeModalId === props.id ? true : false;
  const modalClosing = props.closingModalId === props.id ? true : false;

  return (
    <span>
      <a href='' className='avert-modal-link'
        onClick={(e) => {
          e.preventDefault();
          props.onStoreActiveModal(props.id);
          props.onToggleModalOverlay();
        }}
      >info</a>

      <span className='avert-modal'
        data-modal-id={ props.id }
        data-active={ activeState }
        data-closing={ modalClosing }
      >
        <a href='' className='avert-modal-close'
          onClick={(e) => {
            e.preventDefault();
            props.onResetActiveModal(props.id);
            props.onToggleModalOverlay();
          }}
        >×</a>

        { props.children }
      </span>
    </span>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  onStoreActiveModal: PropTypes.func.isRequired,
  onToggleModalOverlay: PropTypes.func.isRequired,
  activeModalId: PropTypes.number.isRequired,
  closingModalId: PropTypes.number.isRequired,
};

export default Tooltip;
