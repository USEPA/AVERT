import React from 'react';
// components
import Region from './components/Region';
import California from './components/California';
import Carolinas from './components/Carolinas';
import Central from './components/Central';
import Florida from './components/Florida';
import MidAtlantic from './components/MidAtlantic';
import Midwest from './components/Midwest';
import NewEngland from './components/NewEngland';
import NewYork from './components/NewYork';
import Northwest from './components/Northwest';
import RockyMountains from './components/RockyMountains';
import Southeast from './components/Southeast';
import Southwest from './components/Southwest';
import Tennessee from './components/Tennessee';
import Texas from './components/Texas';
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

          <Region id={regions.NCSC.id}>
            <Carolinas />
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

          <Region id={regions.TN.id}>
            <Tennessee />
          </Region>

          <Region id={regions.TE.id}>
            <Texas />
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
            <rect x="565" y="253" width="83" height="22" />
            <text transform="translate(570 270)">{regions.NCSC.name}</text>
          </g>
          <g className="label">
            <rect x="315" y="228" width="65" height="22" />
            <text transform="translate(320 245)">{regions.CENT.name}</text>
          </g>
          <g className="label">
            <rect x="565" y="368" width="63" height="22" />
            <text transform="translate(570 385)">{regions.FL.name}</text>
          </g>
          <g className="label">
            <rect x="535" y="173" width="101" height="22" />
            <text transform="translate(540 190)">{regions.MIDA.name}</text>
          </g>
          <g className="label">
            <rect x="430" y="208" width="73" height="22" />
            <text transform="translate(435 225)">{regions.MIDW.name}</text>
          </g>
          <g className="label">
            <rect x="605" y="38" width="110" height="22" />
            <text transform="translate(610 55)">{regions.NE.name}</text>
          </g>
          <g className="label">
            <rect x="560" y="98" width="82" height="22" />
            <text transform="translate(565 115)">{regions.NY.name}</text>
          </g>
          <g className="label">
            <rect x="105" y="128" width="89" height="22" />
            <text transform="translate(110 145)">{regions.NW.name}</text>
          </g>
          <g className="label">
            <rect x="175" y="198" width="142" height="22" />
            <text transform="translate(180 215)">{regions.RM.name}</text>
          </g>
          <g className="label">
            <rect x="500" y="308" width="88" height="22" />
            <text transform="translate(505 325)">{regions.SE.name}</text>
          </g>
          <g className="label">
            <rect x="140" y="293" width="92" height="22" />
            <text transform="translate(145 310)">{regions.SW.name}</text>
          </g>
          <g className="label">
            <rect x="460" y="258" width="92" height="22" />
            <text transform="translate(465 275)">{regions.TN.name}</text>
          </g>
          <g className="label">
            <rect x="300" y="353" width="55" height="22" />
            <text transform="translate(305 370)">{regions.TE.name}</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default RegionMap;
