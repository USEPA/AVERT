import type { ReactNode } from "react";
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
    <div className={className ? className : ""}>
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
        <select
          id={fieldName}
          className={
            `usa-select ` +
            `display-inline-block height-auto maxw-full ` +
            `margin-y-05 padding-left-1 padding-y-05 padding-right-4 ` +
            `border-width-1px border-solid border-base-light ` +
            `text-bold font-sans-xs`
          }
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
          <span className="margin-left-05">
            <Tooltip>{tooltip}</Tooltip>
          </span>
        )}
      </div>
    </div>
  );
}
