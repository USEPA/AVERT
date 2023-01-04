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

export function EERETextInput(props: {
  label?: string;
  ariaLabel: string;
  suffix?: string;
  value: string;
  fieldName: string;
  disabled?: string;
  onChange: (value: string) => void;
  tooltip?: ReactNode;
}) {
  const {
    label,
    ariaLabel,
    suffix,
    value,
    fieldName,
    disabled,
    onChange,
    tooltip,
  } = props;

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
        <>
          <label htmlFor={fieldName} className="display-inline-block">
            {label}
          </label>
          <br />
        </>
      )}

      <div className="display-flex flex-align-center">
        <input
          id={fieldName}
          className={
            `usa-input ` +
            `display-inline-block margin-y-05 padding-05 height-auto maxw-full ` +
            `border-width-1px border-solid border-base-light ` +
            `text-right text-bold font-sans-xs`
          }
          aria-label={ariaLabel}
          type="text"
          value={value}
          data-avert-eere-input={fieldName}
          disabled={Boolean(disabled)}
          onChange={(ev) => onChange(ev.target.value)}
          onKeyPress={(ev) => {
            if (calculationDisabled) return;
            if (ev.key === 'Enter') dispatch(calculateEereProfile());
          }}
        />

        {suffix && (
          <span className="margin-left-1 font-sans-3xs">{suffix}</span>
        )}

        {tooltip && (
          <span className="margin-left-05">
            <Tooltip id={fieldName}>{tooltip}</Tooltip>
          </span>
        )}
      </div>

      {errors.includes(
        fieldName as EERETextInputFieldName | EVTextInputFieldName,
      ) && (
        <p className="text-italic text-secondary" data-input-error>
          <span className="display-block text-bold text-no-italic">
            Please enter a positive number.
          </span>
          If you wish to model a reverse EE/RE scenario (i.e., a negative
          number), use the Excel version of the AVERT Main Module.
        </p>
      )}
    </>
  );
}
