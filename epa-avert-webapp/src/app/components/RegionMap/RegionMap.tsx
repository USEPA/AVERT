import React from 'react';
// components
import Region from './components/Region';
import California from './components/California';
import UpperMidwest from './components/UpperMidwest';
import Southwest from './components/Southwest';
import Southeast from './components/Southeast';
import Northwest from './components/Northwest';
import Northeast from './components/Northeast';
import LowerMidwest from './components/LowerMidwest';
import GreatLakes from './components/GreatLakes';
import RockyMountains from './components/RockyMountains';
import Texas from './components/Texas';
// config
import { regions } from 'app/config';
// styles
import './styles.css';

function RegionMap() {
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
          <Region id={regions.CA.id}>
            <g fill="#fed330">
              <California />
            </g>
          </Region>

          <Region id={regions.CENT.id}>
            <g fill="#db742b">{/* */}</g>
          </Region>

          <Region id={regions.FL.id}>
            <g fill="#a74c8f">
              <Southwest />
            </g>
          </Region>

          <Region id={regions.MIDA.id}>
            <g fill="#d52074">
              <Southeast />
            </g>
          </Region>

          <Region id={regions.MIDW.id}>
            <g fill="#364f95">
              <RockyMountains />
            </g>
          </Region>

          <Region id={regions.NCSC.id}>
            <g fill="#67b187">
              <Northwest />
            </g>
          </Region>

          <Region id={regions.NE.id}>
            <g fill="#bdc736">
              <Northeast />
            </g>
          </Region>

          <Region id={regions.NW.id}>
            <g fill="#d85029">
              <LowerMidwest />
            </g>
          </Region>

          <Region id={regions.NY.id}>
            <g fill="#fda929">
              <GreatLakes />
            </g>
          </Region>

          <Region id={regions.RM.id}>
            <g fill="#48b5d8">
              <UpperMidwest />
            </g>
          </Region>

          <Region id={regions.SE.id}>
            <g fill="#333333">{/* TODO */}</g>
          </Region>

          <Region id={regions.SW.id}>
            <g fill="#555555">{/* TODO */}</g>
          </Region>

          <Region id={regions.TE.id}>
            <g fill="#777777">
              <Texas />
            </g>
          </Region>

          <Region id={regions.TN.id}>
            <g fill="#999999">{/* TODO */}</g>
          </Region>
        </g>

        <g id="avert-labels">
          <g className="label">
            <rect x="10" y="223" width="85" height="22" />
            <text transform="translate(15 240)">{regions.CA.label}</text>
          </g>
          <g className="label">
            <rect x="465" y="183" width="206" height="22" />
            <text transform="translate(470 200)">{regions.CENT.label}</text>
          </g>
          <g className="label">
            <rect x="275" y="283" width="125" height="22" />
            <text transform="translate(280 300)">{regions.FL.label}</text>
          </g>
          <g className="label">
            <rect x="595" y="113" width="86" height="22" />
            <text transform="translate(600 130)">{regions.MIDA.label}</text>
          </g>
          <g className="label">
            <rect x="95" y="133" width="88" height="22" />
            <text transform="translate(100 150)">{regions.MIDW.label}</text>
          </g>
          <g className="label">
            <rect x="175" y="213" width="142" height="22" />
            <text transform="translate(180 230)">{regions.NCSC.label}</text>
          </g>
          <g className="label">
            <rect x="465" y="323" width="88" height="22" />
            <text transform="translate(470 340)">{regions.NE.label}</text>
          </g>
          <g className="label">
            <rect x="135" y="313" width="92" height="22" />
            <text transform="translate(140 330)">{regions.NW.label}</text>
          </g>
          <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.RM.label}</text>
          </g>
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.SE.label}</text>
          </g> */}
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.SW.label}</text>
          </g> */}
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.NY.label}</text>
          </g> */}
          <g className="label">
            <rect x="295" y="383" width="56" height="22" />
            <text transform="translate(300 400)">{regions.TE.label}</text>
          </g>
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.TN.label}</text>
          </g> */}
        </g>
      </svg>
    </div>
  );
}

export default RegionMap;
