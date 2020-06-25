/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// components
import California from 'app/components/Regions/California';
import Carolinas from 'app/components/Regions/Carolinas';
import Central from 'app/components/Regions/Central';
import Florida from 'app/components/Regions/Florida';
import MidAtlantic from 'app/components/Regions/MidAtlantic';
import Midwest from 'app/components/Regions/Midwest';
import NewEngland from 'app/components/Regions/NewEngland';
import NewYork from 'app/components/Regions/NewYork';
import Northwest from 'app/components/Regions/Northwest';
import RockyMountains from 'app/components/Regions/RockyMountains';
import Southeast from 'app/components/Regions/Southeast';
import Southwest from 'app/components/Regions/Southwest';
import Tennessee from 'app/components/Regions/Tennessee';
import Texas from 'app/components/Regions/Texas';
import UnitedStates from 'app/components/UnitedStates';
// reducers
import { selectRegions } from 'app/redux/reducers/regions';
// hooks
import { useSelectedRegions } from 'app/hooks';
// config
import { RegionId, regions } from 'app/config';

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

const regionStyles = css`
  cursor: pointer;
  opacity: 0.33;

  &:hover {
    opacity: 0.66;
  }

  &[data-active='true'] {
    opacity: 1;
  }
`;

type RegionProps = {
  id: RegionId;
  fill: string;
  children: React.ReactElement<
    | typeof California
    | typeof Carolinas
    | typeof Central
    | typeof Florida
    | typeof MidAtlantic
    | typeof Midwest
    | typeof NewEngland
    | typeof NewYork
    | typeof Northwest
    | typeof RockyMountains
    | typeof Southeast
    | typeof Southwest
    | typeof Tennessee
    | typeof Texas
  >;
};

function Region({ id, fill, children }: RegionProps) {
  const dispatch = useDispatch();

  const regionIds = useSelectedRegions().map((region) => region.id);

  return (
    <g
      css={regionStyles}
      fill={fill}
      onClick={(ev) => dispatch(selectRegions([id]))}
      data-active={regionIds.includes(id)}
    >
      {children}
    </g>
  );
}

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
          <Region id={regions.CA.id} fill="#fed330">
            <California />
          </Region>

          <Region id={regions.NCSC.id} fill="#bdc736">
            <Carolinas />
          </Region>

          <Region id={regions.CENT.id} fill="#a74c8f">
            <Central />
          </Region>

          <Region id={regions.FL.id} fill="#238e86">
            <Florida />
          </Region>

          <Region id={regions.MIDA.id} fill="#db742b">
            <MidAtlantic />
          </Region>

          <Region id={regions.MIDW.id} fill="#48b5d8">
            <Midwest />
          </Region>

          <Region id={regions.NE.id} fill="#d52074">
            <NewEngland />
          </Region>

          <Region id={regions.NY.id} fill="#8449b7">
            <NewYork />
          </Region>

          <Region id={regions.NW.id} fill="#364f95">
            <Northwest />
          </Region>

          <Region id={regions.RM.id} fill="#67b187">
            <RockyMountains />
          </Region>

          <Region id={regions.SE.id} fill="#99781a">
            <Southeast />
          </Region>

          <Region id={regions.SW.id} fill="#d85029">
            <Southwest />
          </Region>

          <Region id={regions.TN.id} fill="#157a15">
            <Tennessee />
          </Region>

          <Region id={regions.TE.id} fill="#fda929">
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
