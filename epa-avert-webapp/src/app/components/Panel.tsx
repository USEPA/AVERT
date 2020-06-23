/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import React from 'react';
// components
import PanelBody from 'app/components/PanelBody/PanelBody';
import PanelFooter from 'app/components/PanelFooter/PanelFooter';

const stepStyles = css`
  &[data-active='false'] {
    display: none;
  }
`;

type Props = {
  active: boolean;
  children: React.ReactElement<typeof PanelBody | typeof PanelFooter>[];
};

function Panel({ active, children }: Props) {
  return (
    <section data-active={active} css={stepStyles}>
      {children}
    </section>
  );
}

export default Panel;
