/** @jsx jsx */

import { jsx, css } from '@emotion/core';
// components
import UnitedStates from 'app/components/UnitedStates';

const containerStyles = css`
  position: relative;
  margin: 1.5rem 0;

  /* padding-top: intrinsic aspect ratio so SVG displays property in IE */
  &::before {
    content: '';
    display: block;
    padding-top: calc(460 / 720 * 100%); /* height and width of svg */
  }

  svg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

const boundaryStyles = css`
  stroke: #fff;
  stroke-width: 0.75px;
  stroke-linejoin: round;
`;

function StatesMap() {
  return (
    <div css={containerStyles}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
      >
        <title>AVERT state map</title>

        <g css={boundaryStyles} data-id="states">
          <UnitedStates fill="#bdc736" />
        </g>
      </svg>
    </div>
  );
}

export default StatesMap;
