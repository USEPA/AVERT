/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// reducers
import { selectRegions } from 'app/redux/reducers/geography';
// hooks
import { useSelectedRegion } from 'app/hooks';
// config
import { RegionId, regions } from 'app/config';

const selectStyles = css`
  margin: 1.5rem 25% 0;
  width: 50%;
`;

function RegionsList() {
  const dispatch = useDispatch();

  const selectedRegionId = useSelectedRegion()?.id;

  return (
    <select
      css={selectStyles}
      value={!selectedRegionId ? '' : selectedRegionId}
      onChange={(ev) => {
        dispatch(selectRegions([ev.target.value] as RegionId[]));
      }}
    >
      <option value={''} disabled>
        Select Region
      </option>
      <option value={regions.CA.id}>{regions.CA.name}</option>
      <option value={regions.NCSC.id}>{regions.NCSC.name}</option>
      <option value={regions.CENT.id}>{regions.CENT.name}</option>
      <option value={regions.FL.id}>{regions.FL.name}</option>
      <option value={regions.MIDA.id}>{regions.MIDA.name}</option>
      <option value={regions.MIDW.id}>{regions.MIDW.name}</option>
      <option value={regions.NE.id}>{regions.NE.name}</option>
      <option value={regions.NY.id}>{regions.NY.name}</option>
      <option value={regions.NW.id}>{regions.NW.name}</option>
      <option value={regions.RM.id}>{regions.RM.name}</option>
      <option value={regions.SE.id}>{regions.SE.name}</option>
      <option value={regions.SW.id}>{regions.SW.name}</option>
      <option value={regions.TN.id}>{regions.TN.name}</option>
      <option value={regions.TE.id}>{regions.TE.name}</option>
    </select>
  );
}

export default RegionsList;
