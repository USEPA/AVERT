import React, { PropTypes } from 'react';

const RegionItem = (props) => (
  <option value={ props.name }>{ props.name }</option>
);

RegionItem.propTypes = {
  name: PropTypes.string.isRequired,
};

export default RegionItem;
