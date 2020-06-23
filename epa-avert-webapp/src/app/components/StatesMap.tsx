import React from 'react';
// components
import UnitedStates from 'app/components/UnitedStates';

function StatesMap() {
  return (
    <div className="avert-region-map">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
      >
        <title>AVERT state map</title>

        <g className="avert-states">
          <UnitedStates fill="#ccc" />
        </g>
      </svg>
    </div>
  );
}

export default StatesMap;
