import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useRegionState, selectRegion } from 'app/redux/region';
// components
import UpperMidwest from './UpperMidwest';
import Texas from './Texas';
import Southwest from './Southwest';
import Southeast from './Southeast';
import RockyMountains from './RockyMountains';
import Northwest from './Northwest';
import Northeast from './Northeast';
import LowerMidwest from './LowerMidwest';
import GreatLakes from './GreatLakes';
import California from './California';

// prettier-ignore
type Props = {
  id: number,
  children: React.ReactElement<
    | typeof UpperMidwest
    | typeof Texas
    | typeof Southwest
    | typeof Southeast
    | typeof RockyMountains
    | typeof Northwest
    | typeof Northeast
    | typeof LowerMidwest
    | typeof GreatLakes
    | typeof California
  >;
};

function Region({ id, children }: Props) {
  const dispatch = useDispatch();
  const regionId = useRegionState(({ id }) => id);

  return (
    <g
      className="avert-region"
      onClick={(ev) => dispatch(selectRegion(id))}
      data-active={id === regionId}
    >
      {children}
    </g>
  );
}

export default Region;
