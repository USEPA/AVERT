import React, { Component, PropTypes } from 'react';
// styles
import './styles.css';

class Tooltip extends Component {
  render() {
    return (
      <span>
        <a href='' className='avert-modal-link'
          onClick={(e) => {
            e.preventDefault();
            this.refs.modal.setAttribute('data-active', 'true');
            this.props.onClickModal();
          }}
        >info</a>

        <div className='avert-modal' data-active='false' ref='modal'>
          <a href='' className='avert-modal-close'
            onClick={(e) => {
              e.preventDefault();
              this.refs.modal.setAttribute('data-active', 'closed');
              this.props.onClickModal();
            }}
          >×</a>

        <p>{ this.props.children }</p>
        </div>
      </span>
    );
  };
}

Tooltip.propTypes = {
  children: PropTypes.node,
  onClickModal: PropTypes.func.isRequired,
};

export default Tooltip;
