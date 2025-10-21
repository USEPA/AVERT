import { type ReactNode } from "react";
import clsx from "clsx";
// ---
import { Tooltip } from "@/components/Tooltip";

export function ImpactsSelectInput(props: {
  className?: string;
  label?: string;
  ariaLabel: string;
  options: { id: string; name: string }[];
  value: string;
  fieldName: string;
  disabled?: string;
  onChange: (value: string) => void;
  tooltip?: ReactNode;
}) {
  const {
    className,
    label,
    ariaLabel,
    options,
    value,
    fieldName,
    disabled,
    onChange,
    tooltip,
  } = props;

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
        <select
          id={fieldName}
          className={clsx(
            "usa-select display-inline-block height-auto maxw-full text-bold font-sans-xs",
            "margin-y-05 padding-left-1 padding-y-05 padding-right-4 border-width-1px border-solid border-base-light",
          )}
          aria-label={ariaLabel}
          value={value}
          data-avert-energy-impacts-input={fieldName}
          disabled={Boolean(disabled)}
          onChange={(ev) => onChange(ev.target.value)}
        >
          {options.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        {tooltip && (
          <span className={clsx("margin-left-05")}>
            <Tooltip>{tooltip}</Tooltip>
          </span>
        )}
      </div>
    </div>
  );
}
