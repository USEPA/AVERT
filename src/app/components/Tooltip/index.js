import React, { Component, PropTypes } from 'react';
// styles
import './styles.css';

class Tooltip extends Component {
  render() {
    let activeState = 'false';
    if (this.props.activeModalId === 0) { activeState = 'closed' }
    if (this.props.activeModalId === this.props.id) { activeState = 'true' }

    return (
      <span>
        <a href='' className='avert-modal-link'
          onClick={(e) => {
            e.preventDefault();
            this.props.onStoreActiveModal(this.props.id);
            this.props.onToggleModalOverlay();
          }}
        >info</a>

        <span className='avert-modal'
          data-modal-id={ this.props.id }
          data-active={ activeState }
        >
          <a href='' className='avert-modal-close'
            onClick={(e) => {
              e.preventDefault();
              this.props.onResetActiveModal();
              this.props.onToggleModalOverlay();
            }}
          >×</a>

          { this.props.children }
        </span>
      </span>
    );
  };
}

Tooltip.propTypes = {
  children: PropTypes.node,
  onStoreActiveModal: PropTypes.func.isRequired,
  onToggleModalOverlay: PropTypes.func.isRequired,
  activeModalId: PropTypes.number.isRequired,
};

export default Tooltip;
