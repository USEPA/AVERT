// @flow

import React from 'react';
// styles
import './styles.css';

type Props = {
  id: number,
  children: string,
  // redux connected props
  activeModalId: number,
  closingModalId: number,
  onStoreActiveModal: (number) => void,
  onResetActiveModal: (number) => void,
  onToggleModalOverlay: () => void,
};

class Tooltip extends React.Component<Props> {
  modalClose: ?HTMLAnchorElement;

  componentDidUpdate() {
    if (this.modalClose) this.modalClose.focus();
  }

  render() {
    return (
      <span>
        <a
          href=""
          className="avert-modal-link"
          onClick={(event) => {
            event.preventDefault();
            this.props.onStoreActiveModal(this.props.id);
            this.props.onToggleModalOverlay();
          }}
        >
          info
        </a>

        <span
          className="avert-modal"
          data-modal-id={this.props.id}
          data-active={this.props.activeModalId === this.props.id}
          data-closing={this.props.closingModalId === this.props.id}
        >
          <a
            className="avert-modal-close"
            href=""
            ref={(ref) => (this.modalClose = ref)}
            onClick={(event) => {
              event.preventDefault();
              this.props.onResetActiveModal(this.props.id);
              this.props.onToggleModalOverlay();
            }}
          >
            ×
          </a>

          {this.props.children}
        </span>
      </span>
    );
  }
}

export default Tooltip;
