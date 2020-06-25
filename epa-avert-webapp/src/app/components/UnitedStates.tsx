import React from 'react';
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

type Props = {
  fill: string;
};

function UnitedStates({ fill }: Props) {
  return (
    <g fill={fill}>
      <Nebraska />
      <Washington />
      <NewMexico />
      <SouthDakota />
      <Texas />
      <California />
      <Kentucky />
      <Ohio />
      <Alabama />
      <Georgia />
      <Wisconsin />
      <Oregon />
      <Pennsylvania />
      <Mississippi />
      <Missouri />
      <NorthCarolina />
      <Oklahoma />
      <WestVirginia />
      <NewYork />
      <Indiana />
      <Kansas />
      <Idaho />
      <Nevada />
      <Vermont />
      <Montana />
      <Minnesota />
      <NorthDakota />
      <Arizona />
      <Delaware />
      <RhodeIsland />
      <Colorado />
      <Utah />
      <Virginia />
      <Wyoming />
      <Louisiana />
      <Michigan />
      <Massachusetts />
      <Florida />
      <Connecticut />
      <NewJersey />
      <Maryland />
      <SouthCarolina />
      <Maine />
      <NewHampshire />
      <DistrictOfColumbia />
      <Iowa />
      <Arkansas />
      <Tennessee />
      <Illinois />
    </g>
  );
}

export default UnitedStates;
