/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// components
import Alabama from 'app/components/States/Alabama';
import Arkansas from 'app/components/States/Arkansas';
import Arizona from 'app/components/States/Arizona';
import California from 'app/components/States/California';
import Colorado from 'app/components/States/Colorado';
import Connecticut from 'app/components/States/Connecticut';
import DistrictOfColumbia from 'app/components/States/DistrictOfColumbia';
import Delaware from 'app/components/States/Delaware';
import Florida from 'app/components/States/Florida';
import Georgia from 'app/components/States/Georgia';
import Iowa from 'app/components/States/Iowa';
import Idaho from 'app/components/States/Idaho';
import Illinois from 'app/components/States/Illinois';
import Indiana from 'app/components/States/Indiana';
import Kansas from 'app/components/States/Kansas';
import Kentucky from 'app/components/States/Kentucky';
import Louisiana from 'app/components/States/Louisiana';
import Massachusetts from 'app/components/States/Massachusetts';
import Maryland from 'app/components/States/Maryland';
import Maine from 'app/components/States/Maine';
import Michigan from 'app/components/States/Michigan';
import Minnesota from 'app/components/States/Minnesota';
import Missouri from 'app/components/States/Missouri';
import Mississippi from 'app/components/States/Mississippi';
import Montana from 'app/components/States/Montana';
import NorthCarolina from 'app/components/States/NorthCarolina';
import NorthDakota from 'app/components/States/NorthDakota';
import Nebraska from 'app/components/States/Nebraska';
import NewHampshire from 'app/components/States/NewHampshire';
import NewJersey from 'app/components/States/NewJersey';
import NewMexico from 'app/components/States/NewMexico';
import Nevada from 'app/components/States/Nevada';
import NewYork from 'app/components/States/NewYork';
import Ohio from 'app/components/States/Ohio';
import Oklahoma from 'app/components/States/Oklahoma';
import Oregon from 'app/components/States/Oregon';
import Pennsylvania from 'app/components/States/Pennsylvania';
import RhodeIsland from 'app/components/States/RhodeIsland';
import SouthCarolina from 'app/components/States/SouthCarolina';
import SouthDakota from 'app/components/States/SouthDakota';
import Tennessee from 'app/components/States/Tennessee';
import Texas from 'app/components/States/Texas';
import Utah from 'app/components/States/Utah';
import Virginia from 'app/components/States/Virginia';
import Vermont from 'app/components/States/Vermont';
import Washington from 'app/components/States/Washington';
import Wisconsin from 'app/components/States/Wisconsin';
import WestVirginia from 'app/components/States/WestVirginia';
import Wyoming from 'app/components/States/Wyoming';
// reducers
import { selectState } from 'app/redux/reducers/states';
// hooks
import { useSelectedState } from 'app/hooks';
// config
import { StateId, states } from 'app/config';

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

const statesStyles = css`
  stroke: #fff;
  stroke-width: 0.75px;
  stroke-linejoin: round;
  fill: #bdc736;
`;

const stateStyles = css`
  cursor: pointer;
  opacity: 0.33;

  &:hover {
    opacity: 0.66;
  }

  &[data-active='true'] {
    opacity: 1;
  }
`;

type StateProps = {
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
};

function State({ id, children }: StateProps) {
  const dispatch = useDispatch();

  const selectedStateId = useSelectedState()?.id;

  return (
    <g
      css={stateStyles}
      onClick={(ev) => dispatch(selectState(id))}
      data-active={selectedStateId === id}
    >
      {children}
    </g>
  );
}

function StatesMap() {
  return (
    <div css={containerStyles}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="460"
        viewBox="0 0 720 460"
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

export default StatesMap;
