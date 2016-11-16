import React, { PropTypes } from 'react';

const SelectItem = (props) => (
  <option value={ props.text }>{ props.text }</option>
);

SelectItem.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SelectItem;
