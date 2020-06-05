import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/region';
// components
import California from './California';
import Central from './Central';
import Florida from './Florida';
import MidAtlantic from './MidAtlantic';
import Midwest from './Midwest';
import Carolinas from './Carolinas';
import NewEngland from './NewEngland';
import NewYork from './NewYork';
import Northwest from './Northwest';
import RockyMountains from './RockyMountains';
import Southeast from './Southeast';
import Southwest from './Southwest';
import Texas from './Texas';
import Tennessee from './Tennessee';

type Props = {
  id: string;
  children: React.ReactElement<
    | typeof California
    | typeof Central
    | typeof Florida
    | typeof MidAtlantic
    | typeof Midwest
    | typeof Carolinas
    | typeof NewEngland
    | typeof NewYork
    | typeof Northwest
    | typeof RockyMountains
    | typeof Southeast
    | typeof Southwest
    | typeof Texas
    | typeof Tennessee
  >;
};

function Region({ id, children }: Props) {
  const dispatch = useDispatch();
  const regionId = useTypedSelector(({ region }) => region.id);

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
