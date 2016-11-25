import React from 'react';
// containers
import RegionContainer from './containers/RegionContainer';
// components
import UpperMidwest from './components/UpperMidwest';
import Texas from './components/Texas';
import Southwest from './components/Southwest';
import Southeast from './components/Southeast';
import RockyMountains from './components/RockyMountains';
import Northwest from './components/Northwest';
import Northeast from './components/Northeast';
import LowerMidwest from './components/LowerMidwest';
import GreatLakes from './components/GreatLakes';
import California from './components/California';
// styles
import './styles.css';

const RegionMap = () => (
  <div className='avert-region-map'>
    <svg xmlns='http://www.w3.org/2000/svg' width='720' height='500' viewBox='0 0 720 500'>
      <title>AVERT region map</title>

      <g id='avert-regions'>
        <RegionContainer regionId='2'>
          <UpperMidwest />
        </RegionContainer>

        <RegionContainer regionId='9'>
          <Texas />
        </RegionContainer>

        <RegionContainer regionId='8'>
          <Southwest />
        </RegionContainer>

        <RegionContainer regionId='7'>
          <Southeast />
        </RegionContainer>

        <RegionContainer regionId='5'>
          <RockyMountains />
        </RegionContainer>

        <RegionContainer regionId='4'>
          <Northwest />
        </RegionContainer>

        <RegionContainer regionId='3'>
          <Northeast />
        </RegionContainer>

        <RegionContainer regionId='10'>
          <LowerMidwest />
        </RegionContainer>

        <RegionContainer regionId='6'>
          <GreatLakes />
        </RegionContainer>

        <RegionContainer regionId='1'>
          <California />
        </RegionContainer>
      </g>

      <g id='avert-labels'>
        <g className='label'>
          <rect x='10' y='223' width='85' height='22'/>
          <text transform='translate(15 240)'>California</text>
        </g>
        <g className='label'>
          <rect x='465' y='183' width='206' height='22'/>
          <text transform='translate(470 200)'>Great Lakes / Mid-Atlantic</text>
        </g>
        <g className='label'>
          <rect x='275' y='283' width='125' height='22'/>
          <text transform='translate(280 300)'>Lower Midwest</text>
        </g>
        <g className='label'>
          <rect x='595' y='113' width='86' height='22'/>
          <text transform='translate(600 130)'>Northeast</text>
        </g>
        <g className='label'>
          <rect x='95' y='133' width='88' height='22'/>
          <text transform='translate(100 150)'>Northwest</text>
        </g>
        <g className='label'>
          <rect x='175' y='213' width='142' height='22'/>
          <text transform='translate(180 230)'>Rocky Mountains</text>
        </g>
        <g className='label'>
          <rect x='465' y='323' width='88' height='22'/>
          <text transform='translate(470 340)'>Southeast</text>
        </g>
        <g className='label'>
          <rect x='135' y='313' width='92' height='22'/>
          <text transform='translate(140 330)'>Southwest</text>
        </g>
        <g className='label'>
          <rect x='295' y='383' width='56' height='22'/>
          <text transform='translate(300 400)'>Texas</text>
        </g>
        <g className='label'>
          <rect x='305' y='143' width='125' height='22'/>
          <text transform='translate(310 160)'>Upper Midwest</text>
        </g>
      </g>
    </svg>
  </div>
);

export default RegionMap;
