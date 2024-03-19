/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react';
// ---
import { useAppDispatch } from '@/app/redux/index';
import { displayModalDialog } from '@/app/redux/reducers/panel';
import { modalLinkStyles } from '@/app/utilities';

export function Tooltip(props: { children: ReactNode; reversed?: boolean }) {
  const { children, reversed } = props;
  const dispatch = useAppDispatch();

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
