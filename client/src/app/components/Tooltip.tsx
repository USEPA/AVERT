/** @jsx jsx */

import React from 'react';
import { jsx, css, keyframes } from '@emotion/core';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import {
  toggleModalOverlay,
  storeActiveModal,
  resetActiveModal,
} from 'app/redux/reducers/panel';
// icons
import icons from 'app/icons.svg';

const scaleUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(0);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
`;

const scaleDownAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(0);
  }
`;

export const modalLinkStyles = css`
  display: inline-block;
  margin-top: -1rem;
  width: 1rem;
  height: 1rem;
  background-image: url(${icons});
  background-size: 400px 200px;
  background-position: -10px -10px;

  position: relative;
  left: 1px;
  bottom: -3px;
  transform: scale(0.75);

  /* hide text */
  text-indent: 400%;
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 25em) {
    transform: scale(0.8125);
  }

  @media (min-width: 30em) {
    transform: scale(0.875);
  }

  @media (min-width: 35em) {
    transform: scale(0.9375);
  }

  @media (min-width: 40em) {
    transform: none;
  }
`;

const modalStyles = css`
  position: fixed;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100% - 3rem);
  max-width: 30rem;
  max-height: calc(100vh - 1rem);
  padding: 1.5rem 1.75rem;
  font-size: 0.875rem !important;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.33);
  background-color: white;

  animation-timing-function: ease-out;
  animation-fill-mode: both;

  &[data-modal-active='true'] {
    /* animation-name: ${scaleUpAnimation}; */
    animation-duration: 0.2s;
  }

  &[data-modal-active='false'] {
    display: none;
  }

  &[data-modal-closing='true'] {
    /* display: inherit; */
    /* animation-name: ${scaleDownAnimation}; */
    animation-duration: 0.3s;
  }

  p {
    font-size: 0.875rem;
  }
`;

const modalCloseStyles = css`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  padding: 0 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.66);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  opacity: 0.25;

  &:hover,
  &:focus {
    opacity: 0.75;
  }
`;

type Props = {
  id: number;
  children: React.ReactNode;
};

function Tooltip({ id, children }: Props) {
  const dispatch = useDispatch();
  const activeModalId = useTypedSelector(({ panel }) => panel.activeModalId);
  const closingModalId = useTypedSelector(({ panel }) => panel.closingModalId);

  const closeLinkRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    if (closeLinkRef.current) closeLinkRef.current.focus();
  }, [closeLinkRef]);

  return (
    <React.Fragment>
      <a
        css={modalLinkStyles}
        href="/"
        onClick={(ev) => {
          ev.preventDefault();
          dispatch(storeActiveModal(id));
          dispatch(toggleModalOverlay());
        }}
      >
        info
      </a>

      <span
        css={modalStyles}
        data-modal-id={id}
        data-modal-active={activeModalId === id}
        data-modal-closing={closingModalId === id}
      >
        <a
          css={modalCloseStyles}
          href="/"
          ref={closeLinkRef}
          data-modal-close
          onClick={(ev) => {
            ev.preventDefault();
            dispatch(resetActiveModal(id));
            dispatch(toggleModalOverlay());
          }}
        >
          ×
        </a>

        {children}
      </span>
    </React.Fragment>
  );
}

export default Tooltip;
