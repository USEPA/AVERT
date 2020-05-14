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
      <option value={regions.CALIFORNIA.number}>
        {regions.CALIFORNIA.label}
      </option>
      <option value={regions.GREAT_LAKES_MID_ATLANTIC.number}>
        {regions.GREAT_LAKES_MID_ATLANTIC.label}
      </option>
      <option value={regions.LOWER_MIDWEST.number}>
        {regions.LOWER_MIDWEST.label}
      </option>
      <option value={regions.NORTHEAST.number}>
        {regions.NORTHEAST.label}
      </option>
      <option value={regions.NORTHWEST.number}>
        {regions.NORTHWEST.label}
      </option>
      <option value={regions.ROCKY_MOUNTAINS.number}>
        {regions.ROCKY_MOUNTAINS.label}
      </option>
      <option value={regions.SOUTHEAST.number}>
        {regions.SOUTHEAST.label}
      </option>
      <option value={regions.SOUTHWEST.number}>
        {regions.SOUTHWEST.label}
      </option>
      <option value={regions.TEXAS.number}>{regions.TEXAS.label}</option>
      <option value={regions.UPPER_MIDWEST.number}>
        {regions.UPPER_MIDWEST.label}
      </option>
    </select>
  );
}

export default RegionList;
