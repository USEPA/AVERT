import { type ReactNode } from "react";
import clsx from "clsx";
// ---
import { Tooltip } from "@/components/Tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/index";
import {
  type EnergyEfficiencyFieldName,
  type RenewableEnergyFieldName,
  type ElectricVehiclesFieldName,
  calculateHourlyEnergyProfile,
} from "@/redux/reducers/impacts";

/**
 * Checks if the input is not an empty string or zero.
 */
function nonZeroInput(input: string) {
  return input !== "" && Number(input) !== 0;
}

export function ImpactsTextInput(props: {
  className?: string;
  label?: ReactNode;
  ariaLabel: string;
  suffix?: string;
  value: string;
  fieldName: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  tooltip?: ReactNode;
  errorMessage?: ReactNode;
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
    errorMessage,
  } = props;

  const dispatch = useAppDispatch();
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );
  const errors = useAppSelector(({ impacts }) => impacts.errors);
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);

  const { utilitySolar, rooftopSolar, utilityStorage, rooftopStorage } = inputs;

  const textInputsAreValid = errors.length === 0;
  const textInputIsEmpty = value.length === 0;

  const utilityStorageError =
    nonZeroInput(utilityStorage) && !nonZeroInput(utilitySolar);

  const rooftopStorageError =
    nonZeroInput(rooftopStorage) && !nonZeroInput(rooftopSolar);

  const hourlyEnergyProfileCalculationDisabled =
    !textInputsAreValid ||
    textInputIsEmpty ||
    utilityStorageError ||
    rooftopStorageError ||
    hourlyEnergyProfile.status === "pending";

  return (
    <div className={clsx(className)}>
      {label && (
        <>
          <label
            htmlFor={fieldName}
            className={clsx(
              "display-inline-block font-sans-2xs line-height-sans-2",
            )}
          >
            {label}
          </label>
          <br />
        </>
      )}

      <div className={clsx("display-flex flex-align-center")}>
        <input
          id={fieldName}
          className={clsx(
            "usa-input display-inline-block height-auto maxw-full text-right text-bold font-sans-xs",
            "margin-y-05 padding-05 border-width-1px border-solid border-base-light",
          )}
          aria-label={ariaLabel}
          type="text"
          value={value}
          data-avert-energy-impacts-input={fieldName}
          disabled={Boolean(disabled)}
          onChange={(ev) => onChange(ev.target.value)}
          onBlur={(ev) => onBlur?.(ev.target.value)}
          onKeyPress={(ev) => {
            if (hourlyEnergyProfileCalculationDisabled) return;
            if (ev.key === "Enter") {
              onBlur?.((ev.target as HTMLInputElement).value);
              dispatch(calculateHourlyEnergyProfile());
            }
          }}
        />

        {suffix && (
          <span className={clsx("margin-left-1 font-sans-3xs")}>{suffix}</span>
        )}

        {tooltip && (
          <span className={clsx("margin-left-05")}>
            <Tooltip>{tooltip}</Tooltip>
          </span>
        )}
      </div>

      {errors.includes(
        fieldName as
          | EnergyEfficiencyFieldName
          | RenewableEnergyFieldName
          | ElectricVehiclesFieldName,
      ) && (
        <p
          className={clsx(
            "margin-0 line-height-sans-3 text-italic text-secondary",
          )}
          data-input-error
        >
          {errorMessage ?? (
            <>
              <span className={clsx("display-block text-bold text-no-italic")}>
                Please enter a positive number.
              </span>
              If you wish to model a reverse energy impacts scenario (i.e., a
              negative number), use the Excel version of the AVERT Main Module.
            </>
          )}
        </p>
      )}
    </div>
  );
}
