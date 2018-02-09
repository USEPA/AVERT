// @flow

import React from 'react';

type Props = {
  value: string,
  disabled: boolean,
  onChange: (string) => void,
  // redux connected props
  valid: boolean,
  onCalculateProfile: () => void,
};

const EEREInputField = (props: Props) => (
  <input
    type='text'
    value={props.value}
    disabled={props.disabled ? props.disabled : false}
    onChange={(event) => props.onChange(event.target.value)}
    onKeyPress={(event) => {
      // if valid prop (state) is true, calculate profile
      if (props.valid && event.key === 'Enter') props.onCalculateProfile();
    }}
  />
);

export default EEREInputField;
