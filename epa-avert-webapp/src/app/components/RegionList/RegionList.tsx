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
  const regionNumber = useTypedSelector(({ region }) => region.number);

  return (
    <select
      className="avert-region-select"
      value={regionNumber}
      onChange={(ev) => dispatch(selectRegion(Number(ev.target.value)))}
    >
      <option value={0} disabled>
        Select Region
      </option>
      <option value={regions.CA.number}>{regions.CA.label}</option>
      <option value={regions.CENT.number}>{regions.CENT.label}</option>
      <option value={regions.FL.number}>{regions.FL.label}</option>
      <option value={regions.MIDA.number}>{regions.MIDA.label}</option>
      <option value={regions.MIDW.number}>{regions.MIDW.label}</option>
      <option value={regions.NCSC.number}>{regions.NCSC.label}</option>
      <option value={regions.NE.number}>{regions.NE.label}</option>
      <option value={regions.NW.number}>{regions.NW.label}</option>
      <option value={regions.NY.number}>{regions.NY.label}</option>
      <option value={regions.RM.number}>{regions.RM.label}</option>
      <option value={regions.SE.number}>{regions.SE.label}</option>
      <option value={regions.SW.number}>{regions.SW.label}</option>
      <option value={regions.TE.number}>{regions.TE.label}</option>
      <option value={regions.TN.number}>{regions.TN.label}</option>
    </select>
  );
}

export default RegionList;
