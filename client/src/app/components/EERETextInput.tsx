import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
// ---
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { calculateHourlyEnergyProfile } from 'app/redux/reducers/eere';
import type {
  EnergyEfficiencyFieldName,
  RenewableEnergyFieldName,
  ElectricVehiclesFieldName,
} from 'app/redux/reducers/eere';

export function EERETextInput(props: {
  className?: string;
  label?: ReactNode;
  ariaLabel: string;
  suffix?: string;
  value: string;
  fieldName: string;
  disabled?: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  tooltip?: ReactNode;
}) {
  const {
    className,
    label,
    ariaLabel,
    suffix,
    value,
    fieldName,
    disabled,
    onChange,
    onBlur,
    tooltip,
  } = props;

  const dispatch = useDispatch();
  const hourlyEnergyProfile = useTypedSelector(
    ({ eere }) => eere.hourlyEnergyProfile,
  );
  const errors = useTypedSelector(({ eere }) => eere.errors);

  const inputsAreValid = errors.length === 0;
  const inputIsEmpty = value.length === 0;

  const hourlyEnergyProfileCalculationDisabled =
    !inputsAreValid || inputIsEmpty || hourlyEnergyProfile.status === 'pending';

  return (
    <div className={className ? className : ''}>
      {label && (
        <>
          <label
            htmlFor={fieldName}
            className="display-inline-block font-sans-2xs line-height-sans-2"
          >
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
          data-avert-energy-impacts-input={fieldName}
          disabled={Boolean(disabled)}
          onChange={(ev) => onChange(ev.target.value)}
          onBlur={(ev) => onBlur && onBlur(ev.target.value)}
          onKeyPress={(ev) => {
            if (hourlyEnergyProfileCalculationDisabled) return;
            if (ev.key === 'Enter') {
              onBlur && onBlur((ev.target as HTMLInputElement).value);
              dispatch(calculateHourlyEnergyProfile());
            }
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
        fieldName as
          | EnergyEfficiencyFieldName
          | RenewableEnergyFieldName
          | ElectricVehiclesFieldName,
      ) && (
        <p className="text-italic text-secondary" data-input-error>
          <span className="display-block text-bold text-no-italic">
            Please enter a positive number.
          </span>
          If you wish to model a reverse EE/RE scenario (i.e., a negative
          number), use the Excel version of the AVERT Main Module.
        </p>
      )}
    </div>
  );
}
