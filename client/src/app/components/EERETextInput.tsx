/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import type { ReactNode } from 'react';
// ---
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { calculateEereProfile } from 'app/redux/reducers/eere';
import type {
  EERETextInputFieldName,
  EVTextInputFieldName,
} from 'app/redux/reducers/eere';

const labelStyles = css`
  font-size: inherit;
`;

const inputStyles = css`
  margin: 0.25rem;
  padding: 0.125rem 0.25rem;
  border: 1px solid #ccc;
  width: 4rem;
  font-size: inherit;
  font-weight: bold;
  text-align: right;

  &:disabled {
    background-color: #f0f0f0; // base-lightest
  }
`;

const suffixStyles = css`
  font-size: 0.875em;
`;

export const errorStyles = css`
  font-style: italic;
  color: rgb(206, 29, 29); // TODO: change to text-secondary
`;

const errorHeadingStyles = css`
  display: block;
  font-weight: bold;
  font-style: normal;
`;

type Props = {
  label?: string;
  ariaLabel: string;
  suffix?: string;
  value: string;
  fieldName: string;
  disabled?: string;
  onChange: (value: string) => void;
  tooltip?: ReactNode;
};

export function EERETextInput({
  label,
  ariaLabel,
  suffix,
  value,
  fieldName,
  disabled,
  onChange,
  tooltip,
}: Props) {
  const dispatch = useDispatch();
  const status = useTypedSelector(({ eere }) => eere.status);
  const errors = useTypedSelector(({ eere }) => eere.errors);

  const inputsAreValid = errors.length === 0;
  const inputIsEmpty = value.length === 0;

  const calculationDisabled =
    !inputsAreValid || inputIsEmpty || status === 'started';

  return (
    <>
      {label && (
        <label css={labelStyles} htmlFor={fieldName}>
          {label}
        </label>
      )}

      <input
        id={fieldName}
        css={inputStyles}
        aria-label={ariaLabel}
        type="text"
        value={value}
        data-avert-eere-input={fieldName}
        disabled={disabled ? true : false}
        onChange={(ev) => onChange(ev.target.value)}
        onKeyPress={(ev) => {
          if (calculationDisabled) return;
          if (ev.key === 'Enter') dispatch(calculateEereProfile());
        }}
      />

      {suffix && <span css={suffixStyles}>{suffix}&nbsp;</span>}

      {tooltip && <Tooltip id={fieldName}>{tooltip}</Tooltip>}

      {errors.includes(
        fieldName as EERETextInputFieldName | EVTextInputFieldName,
      ) && (
        <p css={errorStyles} data-input-error>
          <span css={errorHeadingStyles}>Please enter a positive number.</span>
          If you wish to model a reverse EE/RE scenario (i.e., a negative
          number), use the Excel version of the AVERT Main Module.
        </p>
      )}
    </>
  );
}
