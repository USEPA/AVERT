/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
// components
import PanelTab from 'app/components/PanelTab';
// reducers
import { useTypedSelector } from 'app/redux/index';

const navStyles = css`
  overflow: hidden;
  margin-bottom: 1rem;

  @media (min-width: 35em) {
    border: 1px solid #aaa;
  }
`;

const listStyles = css`
  margin: 0 !important;
  padding: 0 !important;
  list-style: none;
`;

export function PanelTabs() {
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);

  return (
    <nav css={navStyles}>
      <ol css={listStyles}>
        <PanelTab step={1} active={activeStep === 1} title="Select Geography" />
        <PanelTab
          step={2}
          active={activeStep === 2}
          title="Set EE/RE Impacts"
        />
        <PanelTab step={3} active={activeStep === 3} title="Get Results" />
      </ol>
    </nav>
  );
}
