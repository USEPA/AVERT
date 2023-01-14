/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react';
import { useRef, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import { useDispatch } from 'react-redux';
// ---
import { useTypedSelector } from 'app/redux/index';
import {
  toggleModalOverlay,
  storeActiveModal,
  resetActiveModal,
} from 'app/redux/reducers/panel';
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
  left: 1px;
  bottom: -3px;
  border-radius: 50%;
  background-image: url(${icons});
  background-size: 400px 200px;
  background-position: -10px -10px;
  /* hide text */
  text-indent: 400%;
  white-space: nowrap;
  overflow: hidden;
`;

const modalStyles = css`
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100% - 4rem);
  max-width: 30rem;
  max-height: calc(100vh - 1rem);
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.33);

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
`;

const modalCloseStyles = css`
  z-index: 1;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background-color: var(--avert-light-blue);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  opacity: 0.625;

  &:visited {
    color: white;
  }

  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export function Tooltip(props: { id: string; children: ReactNode }) {
  const { id, children } = props;

  const dispatch = useDispatch();
  const activeModalId = useTypedSelector(({ panel }) => panel.activeModalId);
  const closingModalId = useTypedSelector(({ panel }) => panel.closingModalId);

  const closeLinkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (closeLinkRef.current) closeLinkRef.current.focus();
  }, [closeLinkRef]);

  return (
    <>
      <a
        css={modalLinkStyles}
        className="avert-tooltip-icon position-relative display-inline-block width-2 height-2"
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
        className="position-fixed padding-x-4 padding-y-3 bg-white"
        data-modal-id={id}
        data-modal-active={activeModalId === id}
        data-modal-closing={closingModalId === id}
      >
        <a
          css={modalCloseStyles}
          className={
            `position-absolute display-flex flex-align-center flex-justify-center ` +
            `font-sans-md text-center text-bold text-no-underline text-white`
          }
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

        <span className="font-sans-2xs line-height-sans-3">{children}</span>
      </span>
    </>
  );
}
