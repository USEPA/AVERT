import React, { PropTypes } from 'react';
// styles
import './styles.css';

const RegionList = (props) => (
  <select className='avert-region-select' value={ props.selectedRegion }
    onChange={(e) => {
      props.onSelectChange(e.target.value);
    }}
  >
    <option value='' disabled>Select Region</option>
    { props.children }
  </select>
);

RegionList.propTypes = {
  selectedRegion: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default RegionList;
