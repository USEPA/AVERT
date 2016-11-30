import React from 'react';
// styles
import './styles.css';

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="88" height="128" viewBox="0 0 88 128">
    <title>Wind Turbine</title>
    <path className="turbine-base" d="M46.73,123c0,.55-1.22,1-2.73,1s-2.73-.45-2.73-1L42,43.39h4Z"/>
    <g className="turbine-blades">
      <path d="M44,43.13c-2.47,0-2-7.66-2-17.12s.87-22,2-22,2,12.56,2,22S46.47,43.13,44,43.13Z"/>
      <path d="M44,43.13c1.24,2.14-5.66,5.52-13.85,10.25s-19.5,10.25-20,9.31S20,54.72,28.2,50,42.76,41,44,43.13Z"/>
      <path d="M44,43.13C45.24,41,51.61,45.27,59.8,50S78.43,61.76,77.89,62.69,66,58.1,57.85,53.38,42.76,45.27,44,43.13Z"/>
      <circle cx="44" cy="43.13" r="39.13"/>
    </g>
    <circle className="turbine-cap" cx="44" cy="43.39" r="3.79"/>
  </svg>
);

export default LoadingIcon;
