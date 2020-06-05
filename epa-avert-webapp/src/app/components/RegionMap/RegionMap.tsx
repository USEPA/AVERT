import React from 'react';
// components
import Region from './components/Region';
import California from './components/California';
import Central from './components/Central';
import Florida from './components/Florida';
import MidAtlantic from './components/MidAtlantic';
import Midwest from './components/Midwest';
import Carolinas from './components/Carolinas';
import NewEngland from './components/NewEngland';
import NewYork from './components/NewYork';
import Northwest from './components/Northwest';
import RockyMountains from './components/RockyMountains';
import Southeast from './components/Southeast';
import Southwest from './components/Southwest';
import Texas from './components/Texas';
import Tennessee from './components/Tennessee';
import States from './components/States';
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
        height="460"
        viewBox="0 0 720 460"
      >
        <title>AVERT region map</title>

        <g className="avert-regions">
          <Region id={regions.CA.id}>
            <California />
          </Region>

          <Region id={regions.CENT.id}>
            <Central />
          </Region>

          <Region id={regions.FL.id}>
            <Florida />
          </Region>

          <Region id={regions.MIDA.id}>
            <MidAtlantic />
          </Region>

          <Region id={regions.MIDW.id}>
            <Midwest />
          </Region>

          <Region id={regions.NCSC.id}>
            <Carolinas />
          </Region>

          <Region id={regions.NE.id}>
            <NewEngland />
          </Region>

          <Region id={regions.NY.id}>
            <NewYork />
          </Region>

          <Region id={regions.NW.id}>
            <Northwest />
          </Region>

          <Region id={regions.RM.id}>
            <RockyMountains />
          </Region>

          <Region id={regions.SE.id}>
            <Southeast />
          </Region>

          <Region id={regions.SW.id}>
            <Southwest />
          </Region>

          <Region id={regions.TE.id}>
            <Texas />
          </Region>

          <Region id={regions.TN.id}>
            <Tennessee />
          </Region>
        </g>

        <g className="avert-states">
          <States />
        </g>

        <g className="avert-labels">
          <g className="label">
            <rect x="10" y="223" width="85" height="22" />
            <text transform="translate(15 240)">{regions.CA.name}</text>
          </g>
          <g className="label">
            <rect x="465" y="183" width="206" height="22" />
            <text transform="translate(470 200)">{regions.CENT.name}</text>
          </g>
          <g className="label">
            <rect x="275" y="283" width="125" height="22" />
            <text transform="translate(280 300)">{regions.FL.name}</text>
          </g>
          <g className="label">
            <rect x="595" y="113" width="86" height="22" />
            <text transform="translate(600 130)">{regions.MIDA.name}</text>
          </g>
          <g className="label">
            <rect x="95" y="133" width="88" height="22" />
            <text transform="translate(100 150)">{regions.MIDW.name}</text>
          </g>
          <g className="label">
            <rect x="175" y="213" width="142" height="22" />
            <text transform="translate(180 230)">{regions.NCSC.name}</text>
          </g>
          <g className="label">
            <rect x="465" y="323" width="88" height="22" />
            <text transform="translate(470 340)">{regions.NE.name}</text>
          </g>
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.NY.name}</text>
          </g> */}
          <g className="label">
            <rect x="135" y="313" width="92" height="22" />
            <text transform="translate(140 330)">{regions.NW.name}</text>
          </g>
          <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.RM.name}</text>
          </g>
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.SE.name}</text>
          </g> */}
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.SW.name}</text>
          </g> */}
          <g className="label">
            <rect x="295" y="383" width="56" height="22" />
            <text transform="translate(300 400)">{regions.TE.name}</text>
          </g>
          {/* <g className="label">
            <rect x="305" y="143" width="125" height="22" />
            <text transform="translate(310 160)">{regions.TN.name}</text>
          </g> */}
        </g>
      </svg>
    </div>
  );
}

export default RegionMap;
