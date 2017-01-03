import React, { PropTypes } from 'react';
// styles
import './styles.css';

const Tooltip = (props) => {
  let activeState = 'false';
  if (props.activeModalId === 0) { activeState = 'closed' }
  if (props.activeModalId === props.id) { activeState = 'true' }

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
      >
        <a href='' className='avert-modal-close'
          onClick={(e) => {
            e.preventDefault();
            props.onResetActiveModal();
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
};

export default Tooltip;
