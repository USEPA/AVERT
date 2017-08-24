import React, { PropTypes } from 'react';

const EEREInputField = (props) => (
  <input
    type='text'
    value={ props.value }
    disabled={ props.disabled ? props.disabled : false }
    onChange={(e) => {
      props.onChange(e.target.value);
    }}
    onKeyPress={(e) => {
      // if valid prop (state) is true, calculate profile
      if (e.key === 'Enter' && props.valid) { props.onCalculateProfile() }
    }}
  />
);

EEREInputField.propTypes = {
  // valid: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onCalculateProfile: PropTypes.func,
}

export default EEREInputField;
