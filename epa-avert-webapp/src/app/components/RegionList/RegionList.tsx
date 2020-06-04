import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/region';
// config
import { regions } from 'app/config';
// styles
import './styles.css';

function RegionList() {
  const dispatch = useDispatch();
  const regionId = useTypedSelector(({ region }) => region.id);

  return (
    <select
      className="avert-region-select"
      value={regionId}
      onChange={(ev) => dispatch(selectRegion(ev.target.value))}
    >
      <option value={''} disabled>
        Select Region
      </option>
      <option value={regions.CA.id}>{regions.CA.label}</option>
      <option value={regions.CENT.id}>{regions.CENT.label}</option>
      <option value={regions.FL.id}>{regions.FL.label}</option>
      <option value={regions.MIDA.id}>{regions.MIDA.label}</option>
      <option value={regions.MIDW.id}>{regions.MIDW.label}</option>
      <option value={regions.NCSC.id}>{regions.NCSC.label}</option>
      <option value={regions.NE.id}>{regions.NE.label}</option>
      <option value={regions.NW.id}>{regions.NW.label}</option>
      <option value={regions.NY.id}>{regions.NY.label}</option>
      <option value={regions.RM.id}>{regions.RM.label}</option>
      <option value={regions.SE.id}>{regions.SE.label}</option>
      <option value={regions.SW.id}>{regions.SW.label}</option>
      <option value={regions.TE.id}>{regions.TE.label}</option>
      <option value={regions.TN.id}>{regions.TN.label}</option>
    </select>
  );
}

export default RegionList;
