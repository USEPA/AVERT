/** @jsx jsx */

import React from 'react';
import { useDispatch } from 'react-redux';
import { jsx, css } from '@emotion/core';
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
// reducers
import { selectRegions } from 'app/redux/reducers/regions';
// hooks
import { useSelectedRegions } from 'app/hooks';
// config
import { RegionId } from 'app/config';

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

  const regionIds = useSelectedRegions().map((region) => region.id);

  return (
    <g
      css={regionStyles}
      onClick={(ev) => dispatch(selectRegions([id]))}
      data-active={regionIds.includes(id)}
    >
      {children}
    </g>
  );
}

export default Region;
