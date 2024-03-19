/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CaliforniaRegion } from "@/components/Regions/California";
import { CarolinasRegion } from "@/components/Regions/Carolinas";
import { CentralRegion } from "@/components/Regions/Central";
import { FloridaRegion } from "@/components/Regions/Florida";
import { MidAtlanticRegion } from "@/components/Regions/MidAtlantic";
import { MidwestRegion } from "@/components/Regions/Midwest";
import { NewEnglandRegion } from "@/components/Regions/NewEngland";
import { NewYorkRegion } from "@/components/Regions/NewYork";
import { NorthwestRegion } from "@/components/Regions/Northwest";
import { RockyMountainsRegion } from "@/components/Regions/RockyMountains";
import { SoutheastRegion } from "@/components/Regions/Southeast";
import { SouthwestRegion } from "@/components/Regions/Southwest";
import { TennesseeRegion } from "@/components/Regions/Tennessee";
import { TexasRegion } from "@/components/Regions/Texas";
import { Alabama } from "@/components/States/Alabama";
import { Arkansas } from "@/components/States/Arkansas";
import { Arizona } from "@/components/States/Arizona";
import { California } from "@/components/States/California";
import { Colorado } from "@/components/States/Colorado";
import { Connecticut } from "@/components/States/Connecticut";
import { DistrictOfColumbia } from "@/components/States/DistrictOfColumbia";
import { Delaware } from "@/components/States/Delaware";
import { Florida } from "@/components/States/Florida";
import { Georgia } from "@/components/States/Georgia";
import { Iowa } from "@/components/States/Iowa";
import { Idaho } from "@/components/States/Idaho";
import { Illinois } from "@/components/States/Illinois";
import { Indiana } from "@/components/States/Indiana";
import { Kansas } from "@/components/States/Kansas";
import { Kentucky } from "@/components/States/Kentucky";
import { Louisiana } from "@/components/States/Louisiana";
import { Massachusetts } from "@/components/States/Massachusetts";
import { Maryland } from "@/components/States/Maryland";
import { Maine } from "@/components/States/Maine";
import { Michigan } from "@/components/States/Michigan";
import { Minnesota } from "@/components/States/Minnesota";
import { Missouri } from "@/components/States/Missouri";
import { Mississippi } from "@/components/States/Mississippi";
import { Montana } from "@/components/States/Montana";
import { NorthCarolina } from "@/components/States/NorthCarolina";
import { NorthDakota } from "@/components/States/NorthDakota";
import { Nebraska } from "@/components/States/Nebraska";
import { NewHampshire } from "@/components/States/NewHampshire";
import { NewJersey } from "@/components/States/NewJersey";
import { NewMexico } from "@/components/States/NewMexico";
import { Nevada } from "@/components/States/Nevada";
import { NewYork } from "@/components/States/NewYork";
import { Ohio } from "@/components/States/Ohio";
import { Oklahoma } from "@/components/States/Oklahoma";
import { Oregon } from "@/components/States/Oregon";
import { Pennsylvania } from "@/components/States/Pennsylvania";
import { RhodeIsland } from "@/components/States/RhodeIsland";
import { SouthCarolina } from "@/components/States/SouthCarolina";
import { SouthDakota } from "@/components/States/SouthDakota";
import { Tennessee } from "@/components/States/Tennessee";
import { Texas } from "@/components/States/Texas";
import { Utah } from "@/components/States/Utah";
import { Virginia } from "@/components/States/Virginia";
import { Vermont } from "@/components/States/Vermont";
import { Washington } from "@/components/States/Washington";
import { Wisconsin } from "@/components/States/Wisconsin";
import { WestVirginia } from "@/components/States/WestVirginia";
import { Wyoming } from "@/components/States/Wyoming";
import { useAppDispatch } from "@/redux/index";
import {
  selectRegion,
  setRegionSelectStateIdAndRegionIds,
  setRegionSelectCounty,
} from "@/redux/reducers/geography";
import { useSelectedRegion } from "@/hooks";
import type { RegionId } from "@/config";
import { regions } from "@/config";

const containerStyles = css`
  /* padding-top: intrinsic aspect ratio so SVG displays property in IE */
  &::before {
    content: "";
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
    font-size: 14px;
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

  &[data-active="true"] {
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

  const dispatch = useAppDispatch();

  const selectedRegionId = useSelectedRegion()?.id;

  return (
    <g
      css={regionStyles}
      fill={fill}
      onClick={(_ev) => {
        dispatch(selectRegion(id));
        dispatch(setRegionSelectStateIdAndRegionIds(""));
        dispatch(setRegionSelectCounty(""));
      }}
      data-active={selectedRegionId === id}
    >
      {children}
    </g>
  );
}

function RegionsMapContent() {
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
            <rect rx="3" ry="3" x="10" y="224" width="77" height="22" />
            <text transform="translate(18 240)">{regions.CA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="562" y="254" width="75" height="22" />
            <text transform="translate(570 270)">{regions.NCSC.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="316" y="228" width="62" height="22" />
            <text transform="translate(324 244)">{regions.CENT.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="564" y="370" width="60" height="22" />
            <text transform="translate(572 386)">{regions.FL.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="530" y="174" width="92" height="22" />
            <text transform="translate(538 190)">{regions.MIDA.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="430" y="206" width="68" height="22" />
            <text transform="translate(438 222)">{regions.MIDW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="608" y="40" width="97" height="22" />
            <text transform="translate(616 56)">{regions.NE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="560" y="96" width="74" height="22" />
            <text transform="translate(568 112)">{regions.NY.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="104" y="130" width="82" height="22" />
            <text transform="translate(112 146)">{regions.NW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="180" y="200" width="122" height="22" />
            <text transform="translate(188 216)">{regions.RM.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="500" y="308" width="80" height="22" />
            <text transform="translate(508 324)">{regions.SE.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="140" y="292" width="83" height="22" />
            <text transform="translate(148 308)">{regions.SW.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="460" y="258" width="81" height="22" />
            <text transform="translate(468 274)">{regions.TN.name}</text>
          </g>
          <g css={labelStyles}>
            <rect rx="3" ry="3" x="300" y="354" width="51" height="22" />
            <text transform="translate(308 370)">{regions.TE.name}</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function RegionsMap() {
  return (
    <ErrorBoundary
      message={
        <>
          AVERT Regions map error. Please contact AVERT support at{" "}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <RegionsMapContent />
    </ErrorBoundary>
  );
}
