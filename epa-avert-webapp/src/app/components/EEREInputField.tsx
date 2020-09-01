/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { calculateEereProfile } from 'app/redux/reducers/eere';

const inputStyles = css`
  margin: 0.25rem 0;
  padding: 0.125rem 0.25rem;
  border: 1px solid #ccc;
  width: 4rem;
  font-size: inherit;
  font-weight: bold;
  text-align: right;

  &:disabled {
    background-color: #eee;
  }
`;

type Props = {
  value: string;
  disabled?: string;
  onChange: (value: string) => void;
};

function EEREInputField({ value, disabled, onChange }: Props) {
  const dispatch = useDispatch();
  const status = useTypedSelector(({ eere }) => eere.status);
  const errors = useTypedSelector(({ eere }) => eere.errors);

  const inputsAreValid = errors.length === 0;

  const inputIsEmpty = value.length === 0;

  const calculationDisabled =
    !inputsAreValid || inputIsEmpty || status === 'started';

  return (
    <input
      css={inputStyles}
      type="text"
      value={value}
      disabled={disabled ? true : false}
      onChange={(ev) => onChange(ev.target.value)}
      onKeyPress={(ev) => {
        if (calculationDisabled) return;
        if (ev.key === 'Enter') dispatch(calculateEereProfile());
      }}
    />
  );
}

export default EEREInputField;
