/** @jsx jsx */

import { jsx, css } from '@emotion/core';
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
import UnitedStates from 'app/components/UnitedStates';
// config
import { regions } from 'app/config';

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

const labelStyles = css`
  cursor: pointer;
  pointer-events: none;

  rect {
    fill: #111;
    opacity: 0.66;
  }

  text {
    font-family: sans-serif;
    font-weight: 700;
    font-size: 16px;
    fill: #fff;
  }
`;

const boundaryStyles = css`
  stroke: #fff;
  stroke-width: 0.75px;
  stroke-linejoin: round;
`;

const statesStyles = css`
  pointer-events: none;
`;

function RegionMap() {
  return (
    <div css={containerStyles}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
      >
        <title>AVERT region map</title>

        <g data-id="regions" css={boundaryStyles}>
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

        <g data-id="states" css={[boundaryStyles, statesStyles]}>
          <UnitedStates fill="none" />
        </g>

        <g data-id="labels">
          <g css={labelStyles}>
            <rect x="10" y="223" width="85" height="22" />
            <text transform="translate(15 240)">{regions.CA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="565" y="253" width="83" height="22" />
            <text transform="translate(570 270)">{regions.NCSC.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="315" y="228" width="65" height="22" />
            <text transform="translate(320 245)">{regions.CENT.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="565" y="368" width="63" height="22" />
            <text transform="translate(570 385)">{regions.FL.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="535" y="173" width="101" height="22" />
            <text transform="translate(540 190)">{regions.MIDA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="430" y="208" width="73" height="22" />
            <text transform="translate(435 225)">{regions.MIDW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="605" y="38" width="110" height="22" />
            <text transform="translate(610 55)">{regions.NE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="560" y="98" width="82" height="22" />
            <text transform="translate(565 115)">{regions.NY.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="105" y="128" width="89" height="22" />
            <text transform="translate(110 145)">{regions.NW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="175" y="198" width="142" height="22" />
            <text transform="translate(180 215)">{regions.RM.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="500" y="308" width="88" height="22" />
            <text transform="translate(505 325)">{regions.SE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="140" y="293" width="92" height="22" />
            <text transform="translate(145 310)">{regions.SW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="460" y="258" width="92" height="22" />
            <text transform="translate(465 275)">{regions.TN.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="300" y="353" width="55" height="22" />
            <text transform="translate(305 370)">{regions.TE.name}</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default RegionMap;
