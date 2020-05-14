import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/region';
// enums
import Regions from 'app/enums/Regions';
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
      <option value={Regions.CALIFORNIA.number}>
        {Regions.CALIFORNIA.label}
      </option>
      <option value={Regions.GREAT_LAKES_MID_ATLANTIC.number}>
        {Regions.GREAT_LAKES_MID_ATLANTIC.label}
      </option>
      <option value={Regions.LOWER_MIDWEST.number}>
        {Regions.LOWER_MIDWEST.label}
      </option>
      <option value={Regions.NORTHEAST.number}>
        {Regions.NORTHEAST.label}
      </option>
      <option value={Regions.NORTHWEST.number}>
        {Regions.NORTHWEST.label}
      </option>
      <option value={Regions.ROCKY_MOUNTAINS.number}>
        {Regions.ROCKY_MOUNTAINS.label}
      </option>
      <option value={Regions.SOUTHEAST.number}>
        {Regions.SOUTHEAST.label}
      </option>
      <option value={Regions.SOUTHWEST.number}>
        {Regions.SOUTHWEST.label}
      </option>
      <option value={Regions.TEXAS.number}>{Regions.TEXAS.label}</option>
      <option value={Regions.UPPER_MIDWEST.number}>
        {Regions.UPPER_MIDWEST.label}
      </option>
    </select>
  );
}

export default RegionList;
