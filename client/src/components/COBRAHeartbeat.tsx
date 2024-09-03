/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";

const lineAnimation = keyframes`
  100% {
    stroke-dashoffset: -500
  }
`;

const heartPathStyles = css`
  fill: none;
  stroke: #fff;
  stroke-width: 7;
  stroke-miterlimit: 10;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: ${lineAnimation} 3.5s linear infinite;
`;

export function COBRAHeartbeat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="150"
      viewBox="0 0 200 200"
    >
      <g>
        <path
          fill="#662F8D"
          d="M183.3,66.7c0,31.9-27.1,51.5-46.7,70c-13.3,12.3-25.5,25.7-36.7,40
          c-11.1-14.3-23.4-27.7-36.7-40c-19.6-18.5-46.7-38.1-46.7-70c0-23.9,19.4-43.3,43.3-43.3c17.5,0,33.3,10.5,40,26.7
          c9.2-22.1,34.6-32.5,56.7-23.3C172.8,33.4,183.3,49.2,183.3,66.7z"
        />
        <path
          css={heartPathStyles}
          d="M0,100h57.2c0.7,0,1.4-0.4,1.7-1l4.9-9.7c0.4-0.9,1.5-1.2,2.4-0.8c0.3,0.1,0.5,0.3,0.7,0.6
          l9.3,12.8c0.6,0.8,1.7,1,2.5,0.4c0.4-0.3,0.6-0.6,0.7-1l8.4-37.4c0.2-1,1.2-1.6,2.1-1.4c0.8,0.2,1.3,0.8,1.4,1.6l7.7,70.4
          c0.1,1,1,1.7,2,1.6c0.8-0.1,1.4-0.6,1.6-1.4l7.5-33.1c0.2-1,1.2-1.6,2.1-1.4c0.5,0.1,0.9,0.4,1.1,0.8l2.4,3.6
          c0.5,0.8,1.6,1,2.5,0.5c0.3-0.2,0.6-0.5,0.7-0.9l3.6-9.8c0.4-0.9,1.4-1.3,2.3-0.9c0.5,0.2,0.8,0.6,1,1.1l3.1,11
          c0.3,1,1.2,1.5,2.2,1.3c0.5-0.1,0.9-0.5,1.2-1l3.7-7.4c0.4-0.9,1.5-1.2,2.4-0.8c0.1,0,0.1,0.1,0.2,0.1l2.9,1.9
          c0.3,0.2,0.6,0.3,1,0.3H200"
        />
      </g>
    </svg>
  );
}
