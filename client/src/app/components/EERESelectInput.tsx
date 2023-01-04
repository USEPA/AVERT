export function EERESelectInput(props: {
  ariaLabel: string;
  options: { id: string; name: string }[];
  value: string;
  fieldName: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const { ariaLabel, options, value, fieldName, disabled, onChange } = props;

  return (
    <>
      <select
        id={fieldName}
        className={
          `usa-select ` +
          `display-inline-block height-auto width-auto ` +
          `margin-y-05 margin-x-1 padding-left-1 padding-y-05 padding-right-4 ` +
          `border-width-1px border-solid border-base-light ` +
          `text-bold font-sans-xs`
        }
        aria-label={ariaLabel}
        value={value}
        data-avert-eere-input={fieldName}
        disabled={Boolean(disabled)}
        onChange={(ev) => onChange(ev.target.value)}
      >
        {options.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}
