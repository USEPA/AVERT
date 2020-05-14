import React from 'react';
// components
import Region from './components/Region';
import UpperMidwest from './components/UpperMidwest';
import Texas from './components/Texas';
import Southwest from './components/Southwest';
import Southeast from './components/Southeast';
import RockyMountains from './components/RockyMountains';
import Northwest from './components/Northwest';
import Northeast from './components/Northeast';
import LowerMidwest from './components/LowerMidwest';
import GreatLakes from './components/GreatLakes';
import California from './components/California';
// enums
import Regions from 'app/enums/Regions';
// styles
import './styles.css';

function RegionMap() {
  const {
    UPPER_MIDWEST,
    TEXAS,
    SOUTHWEST,
    SOUTHEAST,
    ROCKY_MOUNTAINS,
    NORTHWEST,
    NORTHEAST,
    LOWER_MIDWEST,
    GREAT_LAKES_MID_ATLANTIC,
    CALIFORNIA,
  } = Regions;

  return (
    <div className="avert-region-map">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="500"
        viewBox="0 0 720 500"
      >
        <title>AVERT region map</title>

        <g id="avert-regions">
          <Region number={UPPER_MIDWEST.number}>
            <g id={`region-${UPPER_MIDWEST.slug.toLowerCase()}`}>
              <UpperMidwest />
            </g>
          </Region>

          <Region number={TEXAS.number}>
            <g id={`region-${TEXAS.slug.toLowerCase()}`}>
              <Texas />
            </g>
          </Region>

          <Region number={SOUTHWEST.number}>
            <g id={`region-${SOUTHWEST.slug.toLowerCase()}`}>
              <Southwest />
            </g>
          </Region>

          <Region number={SOUTHEAST.number}>
            <g id={`region-${SOUTHEAST.slug.toLowerCase()}`}>
              <Southeast />
            </g>
          </Region>

          <Region number={ROCKY_MOUNTAINS.number}>
            <g id={`region-${ROCKY_MOUNTAINS.slug.toLowerCase()}`}>
              <RockyMountains />
            </g>
          </Region>

          <Region number={NORTHWEST.number}>
            <g id={`region-${NORTHWEST.slug.toLowerCase()}`}>
              <Northwest />
            </g>
          </Region>

          <Region number={NORTHEAST.number}>
            <g id={`region-${NORTHEAST.slug.toLowerCase()}`}>
              <Northeast />
            </g>
          </Region>

          <Region number={LOWER_MIDWEST.number}>
            <g id={`region-${LOWER_MIDWEST.slug.toLowerCase()}`}>
              <LowerMidwest />
            </g>
          </Region>

          <Region number={GREAT_LAKES_MID_ATLANTIC.number}>
            <g id={`region-${GREAT_LAKES_MID_ATLANTIC.slug.toLowerCase()}`}>
              <GreatLakes />
            </g>
          </Region>

          <Region number={CALIFORNIA.number}>
            <g id={`region-${CALIFORNIA.slug.toLowerCase()}`}>
              <California />
            </g>
          </Region>
        </g>

        <g id="avert-labels">
          <g className="label">
            <rect x="10" y="223" width="85" height="22" />
            <text transform="translate(15 240)">
              {Regions.CALIFORNIA.label}
            </text>
          </g>
          <g className="label">
            <rect x="465" y="183" width="206" height="22" />
            <text transform="translate(470 200)">
              {Regions.GREAT_LAKES_MID_ATLANTIC.label}
            </text>
          </g>
          <g className="label">
            <rect x="275" y="283" width="125" height="22" />
            <text transform="translate(280 300)">
              {Regions.LOWER_MIDWEST.label}
            </text>
          </g>
          <g className="label">
            <rect x="595" y="113" width="86" height="22" />
            <text transform="translate(600 130)">
              {Regions.NORTHEAST.label}
            </text>
          </g>
          <g className="label">
            <rect x="95" y="133" width="88" height="22" />
            <text transform="translate(100 150)">
              {Regions.NORTHWEST.label}
            </text>
          </g>
          <g className="label">
            <rect x="175" y="213" width="142" height="22" />
            <text transform="translate(180 230)">
              {Regions.ROCKY_MOUNTAINS.label}
            </text>
          </g>
          <g className="label">
            <rect x="465" y="323" width="88" height="22" />
            <text transform="translate(470 340)">
              {Regions.SOUTHEAST.label}
            </text>
          </g>
          <g className="label">
            <rect x="135" y="313" width="92" height="22" />
            <text transform="translate(140 330)">
              {Regions.SOUTHWEST.label}
            </text>
          </g>
          <g className="label">
            <rect x="295" y="383" width="56" height="22" />
            <text transform="translate(300 400)">{Regions.TEXAS.label}</text>
          </g>
          <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">
              {Regions.UPPER_MIDWEST.label}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default RegionMap;
