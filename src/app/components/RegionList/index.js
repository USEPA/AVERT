import React, { PropTypes } from 'react';
// styles
import './styles.css';

const RegionList = (props) => (
  <select
    className='avert-region-select'
    value={ props.selectedRegion }
    onChange={(e) => props.onSelectChange(e.target.value)}
  >
    <option value='' disabled>Select Region</option>

    <option value={'1'}>California</option>
    <option value={'10'}>Upper Midwest</option>
    <option value={'3'}>Northeast</option>
    <option value={'4'}>Northwest</option>
    <option value={'5'}>Rocky Mountains</option>
    <option value={'2'}>Great Lakes / Mid-Atlantic</option>
    <option value={'7'}>Southeast</option>
    <option value={'8'}>Southwest</option>
    <option value={'9'}>Texas</option>
    <option value={'6'}>Lower Midwest</option>
  </select>
);

RegionList.propTypes = {
  selectedRegion: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func.isRequired,
};

export default RegionList;
