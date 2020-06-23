/** @jsx jsx */

import { jsx, css, keyframes } from '@emotion/core';

const spin = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const turbineBaseStyles = css`
  fill: #0092cc;
`;

const turbineBladesStyles = css`
  transform-origin: 88px 86.78px; /* center of blades */
  animation: ${spin} 2s linear infinite;

  path {
    fill: #00bee6;
  }

  circle {
    fill: none;
  }
`;

const turbineCapStyles = css`
  fill: #03d5e5;
`;

function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="176"
      height="256"
      viewBox="0 0 176 256"
    >
      <title>Wind Turbine</title>
      <path
        css={turbineBaseStyles}
        d="M93.46,246c0,1.1-2.44,2-5.46,2s-5.46-.9-5.46-2L84,86.78h8Z"
      />
      <g css={turbineBladesStyles}>
        <path d="M88,86.26c-4.94,0-4-15.32-4-34.24S85.74,8,88,8s4,25.12,4,44S92.94,86.26,88,86.26Z" />
        <path d="M88,86.26c2.48,4.28-11.32,11-27.7,20.5s-39,20.5-40,18.62S40,109.44,56.4,100,85.52,82,88,86.26Z" />
        <path d="M88,86.26C90.48,82,103.22,90.54,119.6,100s37.26,23.52,36.18,25.38S132,116.2,115.7,106.76,85.52,90.54,88,86.26Z" />
        <circle cx="88" cy="86.26" r="78.26" />
      </g>
      <circle css={turbineCapStyles} cx="88" cy="86.78" r="7.58" />
    </svg>
  );
}

export default LoadingIcon;
