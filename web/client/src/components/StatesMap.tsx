/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
import { selectState } from "@/redux/reducers/geography";
import { useSelectedState } from "@/hooks";
import { StateId, states } from "@/config";

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

const statesStyles = css`
  stroke: #fff;
  stroke-width: 0.75px;
  stroke-linejoin: round;
  fill: #00bee6;
`;

const stateStyles = css`
  cursor: pointer;
  opacity: 0.33;

  &:hover {
    opacity: 0.66;
  }

  &[data-active="true"] {
    opacity: 1;
  }
`;

function State(props: {
  id: StateId;
  children: React.ReactElement<
    | typeof Alabama
    | typeof Arkansas
    | typeof Arizona
    | typeof California
    | typeof Colorado
    | typeof Connecticut
    | typeof DistrictOfColumbia
    | typeof Delaware
    | typeof Florida
    | typeof Georgia
    | typeof Iowa
    | typeof Idaho
    | typeof Illinois
    | typeof Indiana
    | typeof Kansas
    | typeof Kentucky
    | typeof Louisiana
    | typeof Massachusetts
    | typeof Maryland
    | typeof Maine
    | typeof Michigan
    | typeof Minnesota
    | typeof Missouri
    | typeof Mississippi
    | typeof Montana
    | typeof NorthCarolina
    | typeof NorthDakota
    | typeof Nebraska
    | typeof NewHampshire
    | typeof NewJersey
    | typeof NewMexico
    | typeof Nevada
    | typeof NewYork
    | typeof Ohio
    | typeof Oklahoma
    | typeof Oregon
    | typeof Pennsylvania
    | typeof RhodeIsland
    | typeof SouthCarolina
    | typeof SouthDakota
    | typeof Tennessee
    | typeof Texas
    | typeof Utah
    | typeof Virginia
    | typeof Vermont
    | typeof Washington
    | typeof Wisconsin
    | typeof WestVirginia
    | typeof Wyoming
  >;
}) {
  const { id, children } = props;

  const dispatch = useAppDispatch();

  const selectedStateId = useSelectedState()?.id;

  return (
    <g
      css={stateStyles}
      onClick={(_ev) => dispatch(selectState(id))}
      data-active={selectedStateId === id}
    >
      {children}
    </g>
  );
}

function StatesMapContent() {
  return (
    <div
      css={containerStyles}
      className={clsx(
        "position-relative margin-x-auto margin-y-3 maxw-tablet-lg",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
        data-avert-state-map
      >
        <title>AVERT state map</title>

        <g css={statesStyles} data-id="states">
          <State id={states.AL.id}>
            <Alabama />
          </State>

          <State id={states.AR.id}>
            <Arkansas />
          </State>

          <State id={states.AZ.id}>
            <Arizona />
          </State>

          <State id={states.CA.id}>
            <California />
          </State>

          <State id={states.CO.id}>
            <Colorado />
          </State>

          <State id={states.CT.id}>
            <Connecticut />
          </State>

          <State id={states.DC.id}>
            <DistrictOfColumbia />
          </State>

          <State id={states.DE.id}>
            <Delaware />
          </State>

          <State id={states.FL.id}>
            <Florida />
          </State>

          <State id={states.GA.id}>
            <Georgia />
          </State>

          <State id={states.IA.id}>
            <Iowa />
          </State>

          <State id={states.ID.id}>
            <Idaho />
          </State>

          <State id={states.IL.id}>
            <Illinois />
          </State>

          <State id={states.IN.id}>
            <Indiana />
          </State>

          <State id={states.KS.id}>
            <Kansas />
          </State>

          <State id={states.KY.id}>
            <Kentucky />
          </State>

          <State id={states.LA.id}>
            <Louisiana />
          </State>

          <State id={states.MA.id}>
            <Massachusetts />
          </State>

          <State id={states.MD.id}>
            <Maryland />
          </State>

          <State id={states.ME.id}>
            <Maine />
          </State>

          <State id={states.MI.id}>
            <Michigan />
          </State>

          <State id={states.MN.id}>
            <Minnesota />
          </State>

          <State id={states.MO.id}>
            <Missouri />
          </State>

          <State id={states.MS.id}>
            <Mississippi />
          </State>

          <State id={states.MT.id}>
            <Montana />
          </State>

          <State id={states.NC.id}>
            <NorthCarolina />
          </State>

          <State id={states.ND.id}>
            <NorthDakota />
          </State>

          <State id={states.NE.id}>
            <Nebraska />
          </State>

          <State id={states.NH.id}>
            <NewHampshire />
          </State>

          <State id={states.NJ.id}>
            <NewJersey />
          </State>

          <State id={states.NM.id}>
            <NewMexico />
          </State>

          <State id={states.NV.id}>
            <Nevada />
          </State>

          <State id={states.NY.id}>
            <NewYork />
          </State>

          <State id={states.OH.id}>
            <Ohio />
          </State>

          <State id={states.OK.id}>
            <Oklahoma />
          </State>

          <State id={states.OR.id}>
            <Oregon />
          </State>

          <State id={states.PA.id}>
            <Pennsylvania />
          </State>

          <State id={states.RI.id}>
            <RhodeIsland />
          </State>

          <State id={states.SC.id}>
            <SouthCarolina />
          </State>

          <State id={states.SD.id}>
            <SouthDakota />
          </State>

          <State id={states.TN.id}>
            <Tennessee />
          </State>

          <State id={states.TX.id}>
            <Texas />
          </State>

          <State id={states.UT.id}>
            <Utah />
          </State>

          <State id={states.VA.id}>
            <Virginia />
          </State>

          <State id={states.VT.id}>
            <Vermont />
          </State>

          <State id={states.WA.id}>
            <Washington />
          </State>

          <State id={states.WI.id}>
            <Wisconsin />
          </State>

          <State id={states.WV.id}>
            <WestVirginia />
          </State>

          <State id={states.WY.id}>
            <Wyoming />
          </State>
        </g>
      </svg>
    </div>
  );
}

export function StatesMap() {
  return (
    <ErrorBoundary
      message={
        <>
          States map error. Please contact AVERT support at{" "}
          <a
            className={clsx("usa-link")}
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <StatesMapContent />
    </ErrorBoundary>
  );
}
