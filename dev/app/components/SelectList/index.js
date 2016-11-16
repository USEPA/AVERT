import React, { PropTypes } from 'react';
// styles
import './styles.css';

const SelectList = (props) => (
  <select className='avert-region-select' defaultValue='' onChange={(e) => {
      props.onSelectChange(e.target.value);
    }}
  >
    <option value='' disabled>Select Region</option>
    { props.children }
  </select>
);

SelectList.propTypes = {
  onSelectChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default SelectList;
