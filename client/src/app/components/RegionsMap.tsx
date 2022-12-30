/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// ---
import { CaliforniaRegion } from 'app/components/Regions/California';
import { CarolinasRegion } from 'app/components/Regions/Carolinas';
import { CentralRegion } from 'app/components/Regions/Central';
import { FloridaRegion } from 'app/components/Regions/Florida';
import { MidAtlanticRegion } from 'app/components/Regions/MidAtlantic';
import { MidwestRegion } from 'app/components/Regions/Midwest';
import { NewEnglandRegion } from 'app/components/Regions/NewEngland';
import { NewYorkRegion } from 'app/components/Regions/NewYork';
import { NorthwestRegion } from 'app/components/Regions/Northwest';
import { RockyMountainsRegion } from 'app/components/Regions/RockyMountains';
import { SoutheastRegion } from 'app/components/Regions/Southeast';
import { SouthwestRegion } from 'app/components/Regions/Southwest';
import { TennesseeRegion } from 'app/components/Regions/Tennessee';
import { TexasRegion } from 'app/components/Regions/Texas';
import { Alabama } from 'app/components/States/Alabama';
import { Arkansas } from 'app/components/States/Arkansas';
import { Arizona } from 'app/components/States/Arizona';
import { California } from 'app/components/States/California';
import { Colorado } from 'app/components/States/Colorado';
import { Connecticut } from 'app/components/States/Connecticut';
import { DistrictOfColumbia } from 'app/components/States/DistrictOfColumbia';
import { Delaware } from 'app/components/States/Delaware';
import { Florida } from 'app/components/States/Florida';
import { Georgia } from 'app/components/States/Georgia';
import { Iowa } from 'app/components/States/Iowa';
import { Idaho } from 'app/components/States/Idaho';
import { Illinois } from 'app/components/States/Illinois';
import { Indiana } from 'app/components/States/Indiana';
import { Kansas } from 'app/components/States/Kansas';
import { Kentucky } from 'app/components/States/Kentucky';
import { Louisiana } from 'app/components/States/Louisiana';
import { Massachusetts } from 'app/components/States/Massachusetts';
import { Maryland } from 'app/components/States/Maryland';
import { Maine } from 'app/components/States/Maine';
import { Michigan } from 'app/components/States/Michigan';
import { Minnesota } from 'app/components/States/Minnesota';
import { Missouri } from 'app/components/States/Missouri';
import { Mississippi } from 'app/components/States/Mississippi';
import { Montana } from 'app/components/States/Montana';
import { NorthCarolina } from 'app/components/States/NorthCarolina';
import { NorthDakota } from 'app/components/States/NorthDakota';
import { Nebraska } from 'app/components/States/Nebraska';
import { NewHampshire } from 'app/components/States/NewHampshire';
import { NewJersey } from 'app/components/States/NewJersey';
import { NewMexico } from 'app/components/States/NewMexico';
import { Nevada } from 'app/components/States/Nevada';
import { NewYork } from 'app/components/States/NewYork';
import { Ohio } from 'app/components/States/Ohio';
import { Oklahoma } from 'app/components/States/Oklahoma';
import { Oregon } from 'app/components/States/Oregon';
import { Pennsylvania } from 'app/components/States/Pennsylvania';
import { RhodeIsland } from 'app/components/States/RhodeIsland';
import { SouthCarolina } from 'app/components/States/SouthCarolina';
import { SouthDakota } from 'app/components/States/SouthDakota';
import { Tennessee } from 'app/components/States/Tennessee';
import { Texas } from 'app/components/States/Texas';
import { Utah } from 'app/components/States/Utah';
import { Virginia } from 'app/components/States/Virginia';
import { Vermont } from 'app/components/States/Vermont';
import { Washington } from 'app/components/States/Washington';
import { Wisconsin } from 'app/components/States/Wisconsin';
import { WestVirginia } from 'app/components/States/WestVirginia';
import { Wyoming } from 'app/components/States/Wyoming';
import { selectRegion } from 'app/redux/reducers/geography';
import { useSelectedRegion } from 'app/hooks';
import { RegionId, regions } from 'app/config';

const containerStyles = css`
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
    font-weight: 700;
    font-size: 15px;
    fill: #fff;
  }
`;

const outlineStyles = css`
  stroke: #fff;
  stroke-width: 0.75px;
  stroke-linejoin: round;
`;

const statesStyles = css`
  fill: none;
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

function Region(props: {
  id: RegionId;
  fill: string;
  children: React.ReactElement<
    | typeof CaliforniaRegion
    | typeof CarolinasRegion
    | typeof CentralRegion
    | typeof FloridaRegion
    | typeof MidAtlanticRegion
    | typeof MidwestRegion
    | typeof NewEnglandRegion
    | typeof NewYorkRegion
    | typeof NorthwestRegion
    | typeof RockyMountainsRegion
    | typeof SoutheastRegion
    | typeof SouthwestRegion
    | typeof TennesseeRegion
    | typeof TexasRegion
  >;
}) {
  const { id, fill, children } = props;

  const dispatch = useDispatch();

  const selectedRegionId = useSelectedRegion()?.id;

  return (
    <g
      css={regionStyles}
      fill={fill}
      onClick={(ev) => dispatch(selectRegion(id))}
      data-active={selectedRegionId === id}
    >
      {children}
    </g>
  );
}

export function RegionsMap() {
  return (
    <div
      css={containerStyles}
      className="position-relative margin-x-auto margin-y-3 maxw-tablet-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
        data-avert-region-map
      >
        <title>AVERT region map</title>

        <g data-id="regions" css={outlineStyles}>
          <Region id={regions.CA.id} fill="#fed330">
            <CaliforniaRegion />
          </Region>

          <Region id={regions.NCSC.id} fill="#bdc736">
            <CarolinasRegion />
          </Region>

          <Region id={regions.CENT.id} fill="#a74c8f">
            <CentralRegion />
          </Region>

          <Region id={regions.FL.id} fill="#238e86">
            <FloridaRegion />
          </Region>

          <Region id={regions.MIDA.id} fill="#db742b">
            <MidAtlanticRegion />
          </Region>

          <Region id={regions.MIDW.id} fill="#48b5d8">
            <MidwestRegion />
          </Region>

          <Region id={regions.NE.id} fill="#d52074">
            <NewEnglandRegion />
          </Region>

          <Region id={regions.NY.id} fill="#8449b7">
            <NewYorkRegion />
          </Region>

          <Region id={regions.NW.id} fill="#364f95">
            <NorthwestRegion />
          </Region>

          <Region id={regions.RM.id} fill="#67b187">
            <RockyMountainsRegion />
          </Region>

          <Region id={regions.SE.id} fill="#99781a">
            <SoutheastRegion />
          </Region>

          <Region id={regions.SW.id} fill="#d85029">
            <SouthwestRegion />
          </Region>

          <Region id={regions.TN.id} fill="#157a15">
            <TennesseeRegion />
          </Region>

          <Region id={regions.TE.id} fill="#fda929">
            <TexasRegion />
          </Region>
        </g>

        <g data-id="states" css={[outlineStyles, statesStyles]}>
          <Alabama />
          <Arkansas />
          <Arizona />
          <California />
          <Colorado />
          <Connecticut />
          <DistrictOfColumbia />
          <Delaware />
          <Florida />
          <Georgia />
          <Iowa />
          <Idaho />
          <Illinois />
          <Indiana />
          <Kansas />
          <Kentucky />
          <Louisiana />
          <Massachusetts />
          <Maryland />
          <Maine />
          <Michigan />
          <Minnesota />
          <Missouri />
          <Mississippi />
          <Montana />
          <NorthCarolina />
          <NorthDakota />
          <Nebraska />
          <NewHampshire />
          <NewJersey />
          <NewMexico />
          <Nevada />
          <NewYork />
          <Ohio />
          <Oklahoma />
          <Oregon />
          <Pennsylvania />
          <RhodeIsland />
          <SouthCarolina />
          <SouthDakota />
          <Tennessee />
          <Texas />
          <Utah />
          <Virginia />
          <Vermont />
          <Washington />
          <Wisconsin />
          <WestVirginia />
          <Wyoming />
        </g>

        <g data-id="labels">
          <g css={labelStyles}>
            <rect x="10" y="224" width="75" height="22" />
            <text transform="translate(15 240)">{regions.CA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="565" y="254" width="73" height="22" />
            <text transform="translate(570 270)">{regions.NCSC.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="315" y="229" width="59" height="22" />
            <text transform="translate(320 245)">{regions.CENT.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="565" y="369" width="57" height="22" />
            <text transform="translate(570 385)">{regions.FL.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="535" y="174" width="91" height="22" />
            <text transform="translate(540 190)">{regions.MIDA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="430" y="209" width="66" height="22" />
            <text transform="translate(435 225)">{regions.MIDW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="605" y="39" width="96" height="22" />
            <text transform="translate(610 55)">{regions.NE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="560" y="99" width="72" height="22" />
            <text transform="translate(565 115)">{regions.NY.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="105" y="129" width="80" height="22" />
            <text transform="translate(110 145)">{regions.NW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="175" y="199" width="123" height="22" />
            <text transform="translate(180 215)">{regions.RM.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="500" y="309" width="78" height="22" />
            <text transform="translate(505 325)">{regions.SE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="140" y="294" width="81" height="22" />
            <text transform="translate(145 310)">{regions.SW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="460" y="259" width="79" height="22" />
            <text transform="translate(465 275)">{regions.TN.name}</text>
          </g>
          <g css={labelStyles}>
            <rect x="300" y="354" width="47" height="22" />
            <text transform="translate(305 370)">{regions.TE.name}</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
