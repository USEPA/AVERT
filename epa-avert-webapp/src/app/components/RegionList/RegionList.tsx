import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/region';
import { selectRegions } from 'app/redux/reducers/regions';
// config
import { RegionId, regions } from 'app/config';
// styles
import './styles.css';

function RegionList() {
  const dispatch = useDispatch();
  const regionId = useTypedSelector(({ region }) => region.id);

  return (
    <select
      className="avert-region-select"
      value={regionId}
      onChange={(ev) => {
        dispatch(selectRegion(ev.target.value));
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

export default RegionList;
