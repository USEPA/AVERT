// @flow

import React from 'react';
// enums
import Regions from 'app/enums/Regions';
// styles
import './styles.css';

type Props = {
  // redux connected props
  selectedRegion: number,
  onSelectChange: (number) => void,
};

// prettier-ignore
const RegionList = (props: Props) => (
  <select
    className="avert-region-select"
    value={props.selectedRegion}
    onChange={(event) => props.onSelectChange(Number(event.target.value))}
  >
    <option value={0} disabled>
      Select Region
    </option>
    <option value={Regions.CALIFORNIA.id}>
      {Regions.CALIFORNIA.label}
    </option>
    <option value={Regions.GREAT_LAKES_MID_ATLANTIC.id}>
      {Regions.GREAT_LAKES_MID_ATLANTIC.label}
    </option>
    <option value={Regions.LOWER_MIDWEST.id}>
      {Regions.LOWER_MIDWEST.label}
    </option>
    <option value={Regions.NORTHEAST.id}>
      {Regions.NORTHEAST.label}
    </option>
    <option value={Regions.NORTHWEST.id}>
      {Regions.NORTHWEST.label}
    </option>
    <option value={Regions.ROCKY_MOUNTAINS.id}>
      {Regions.ROCKY_MOUNTAINS.label}
    </option>
    <option value={Regions.SOUTHEAST.id}>
      {Regions.SOUTHEAST.label}
    </option>
    <option value={Regions.SOUTHWEST.id}>
      {Regions.SOUTHWEST.label}
    </option>
    <option value={Regions.TEXAS.id}>
      {Regions.TEXAS.label}
    </option>
    <option value={Regions.UPPER_MIDWEST.id}>
      {Regions.UPPER_MIDWEST.label}
    </option>
  </select>
);

export default RegionList;
