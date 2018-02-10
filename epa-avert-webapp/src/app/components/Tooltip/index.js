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

const Tooltip = (props: Props) => {
  const activeState = props.activeModalId === props.id;
  const modalClosing = props.closingModalId === props.id;

  return (
    <span>
      <a href='' className='avert-modal-link'
        onClick={(event) => {
          event.preventDefault();
          props.onStoreActiveModal(props.id);
          props.onToggleModalOverlay();
        }}
      >info</a>

      <span className='avert-modal'
        data-modal-id={props.id}
        data-active={activeState}
        data-closing={modalClosing}
      >
        <a href='' className='avert-modal-close'
          onClick={(event) => {
            event.preventDefault();
            props.onResetActiveModal(props.id);
            props.onToggleModalOverlay();
          }}
        >×</a>

        {props.children}
      </span>
    </span>
  );
};

export default Tooltip;
