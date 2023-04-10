/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// ---
import { displayModalDialog } from 'app/redux/reducers/panel';
import icons from 'app/icons.svg';

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

export function Tooltip(props: {
  id: string; // TODO: remove
  children: ReactNode;
  reversed?: boolean;
}) {
  const { children, reversed } = props;
  const dispatch = useDispatch();

  return (
    <a
      css={[modalLinkStyles, reversed && { backgroundPosition: '-10px -40px' }]}
      className="avert-tooltip-icon position-relative display-inline-block width-2 height-2"
      href="/"
      onClick={(ev) => {
        ev.preventDefault();
        dispatch(displayModalDialog(children));
      }}
    >
      click for additional information
    </a>
  );
}
