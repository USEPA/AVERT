/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// components
import { RegionComponent } from 'app/components/RegionMap/RegionMap';
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
  children: RegionComponent;
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
