import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import { useEereState, calculateEereProfile } from 'app/redux/reducers/eere';

type Props = {
  value: string;
  disabled?: string;
  onChange: (value: string) => void;
};

function EEREInputField({ value, disabled, onChange }: Props) {
  const dispatch = useDispatch();
  const valid = useEereState(({ valid }) => valid);

  return (
    <input
      type="text"
      value={value}
      disabled={disabled ? true : false}
      onChange={(ev) => onChange(ev.target.value)}
      onKeyPress={(ev) => {
        // if eere is valid is true, calculate profile
        if (valid && ev.key === 'Enter') dispatch(calculateEereProfile());
      }}
    />
  );
}

export default EEREInputField;
