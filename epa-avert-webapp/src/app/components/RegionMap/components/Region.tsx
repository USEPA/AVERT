import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/region';
import { selectRegions } from 'app/redux/reducers/regions';
// components
import California from './California';
import Carolinas from './Carolinas';
import Central from './Central';
import Florida from './Florida';
import MidAtlantic from './MidAtlantic';
import Midwest from './Midwest';
import NewEngland from './NewEngland';
import NewYork from './NewYork';
import Northwest from './Northwest';
import RockyMountains from './RockyMountains';
import Southeast from './Southeast';
import Southwest from './Southwest';
import Tennessee from './Tennessee';
import Texas from './Texas';
// config
import { RegionId } from 'app/config';

type Props = {
  id: RegionId;
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

function Region({ id, children }: Props) {
  const dispatch = useDispatch();
  const regionId = useTypedSelector(({ region }) => region.id);

  return (
    <g
      className="avert-region"
      onClick={(ev) => {
        dispatch(selectRegion(id));
        dispatch(selectRegions([id]));
      }}
      data-active={id === regionId}
    >
      {children}
    </g>
  );
}

export default Region;
