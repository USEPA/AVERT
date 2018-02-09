// @flow

import React from 'react';
// types
import type { ChildrenArray, Element } from 'react';
import UpperMidwest from '../UpperMidwest';
import Texas from '../Texas';
import Southwest from '../Southwest';
import Southeast from '../Southeast';
import RockyMountains from '../RockyMountains';
import Northwest from '../Northwest';
import Northeast from '../Northeast';
import LowerMidwest from '../LowerMidwest';
import GreatLakes from '../GreatLakes';
import California from '../California';

type Props = {
  regionId: number,
  children: ChildrenArray<
    | Element<typeof UpperMidwest>
    | Element<typeof Texas>
    | Element<typeof Southwest>
    | Element<typeof Southeast>
    | Element<typeof RockyMountains>
    | Element<typeof Northwest>
    | Element<typeof Northeast>
    | Element<typeof LowerMidwest>
    | Element<typeof GreatLakes>
    | Element<typeof California>
  >,
  // redux connected props
  selectedRegion: number,
  onRegionClick: (number) => void,
};

const Region = (props: Props) => (
  <g className='avert-region'
    onClick={(event) => { props.onRegionClick(props.regionId) }}
    data-active={props.regionId === props.selectedRegion ? true : false}
  >
    {props.children}
  </g>
);

export default Region;
