/** @jsx jsx */

import { jsx, css } from '@emotion/core';
// components
import StepTab from 'app/components/StepTab';
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

function PanelNav() {
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);

  return (
    <nav css={navStyles}>
      <ol css={listStyles}>
        <StepTab step={1} active={activeStep === 1} title="Select Region" />
        <StepTab step={2} active={activeStep === 2} title="Set EE/RE Impacts" />
        <StepTab step={3} active={activeStep === 3} title="Get Results" />
      </ol>
    </nav>
  );
}

export default PanelNav;
