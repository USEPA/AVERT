/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { css } from "@emotion/react";
import clsx from "clsx";
// ---
import { Tooltip } from "@/components/Tooltip";

const unitConversionStyles = css`
  @media (min-width: 40em) {
    float: right;
    margin-bottom: 0;
    width: calc(100% / 3);
  }
`;

export function UnitConversion() {
  const [error, setError] = useState(false);
  const [kw, setKw] = useState(1_000_000);
  const [mw, setMw] = useState(1_000);
  const [gw, setGw] = useState(1);

  function updateInputs(value: string, unit: "kw" | "mw" | "gw") {
    const input = Number(value);

    if (isNaN(input) || input < 0) {
      setError(true);
      return;
    }

    const factor = 1_000;
    const computed = { kw, mw, gw };
    computed[unit] = input;

    if (unit === "gw") {
      computed.mw = input * factor;
      computed.kw = input * factor * factor;
    }

    if (unit === "mw") {
      computed.gw = input / factor;
      computed.kw = input * factor;
    }

    if (unit === "kw") {
      computed.gw = input / factor / factor;
      computed.mw = input / factor;
    }

    setError(false);
    setKw(computed.kw);
    setMw(computed.mw);
    setGw(computed.gw);
  }

  return (
    <div
      css={unitConversionStyles}
      className={clsx(
        "avert-box",
        "margin-bottom-2 padding-105",
        "tablet:margin-left-2",
      )}
    >
      <h4 className={clsx("avert-box-heading", "font-serif-xs")}>
        Helpful Unit Conversions{" "}
        <Tooltip>
          <p className={clsx("text-normal")}>
            To convert units from power (<strong>kW, MW, GW</strong>) to energy
            (<strong>kWh, MWh, GWh</strong>), multiply by the total number of
            hours in the year. To convert in the other direction, divide by the
            total number of hours in the year. There are{" "}
            <strong>8,760 hours</strong> in a non-leap year and{" "}
            <strong>8,784 hours</strong> in a leap year.
          </p>

          <p className={clsx("margin-0 text-normal")}>
            <strong>Example:</strong>&nbsp;
            <em>converting energy to power for 2016 (leap year):</em>
            <br />
            10,000 kWh ÷ 8,784 h = 1.14 kW
          </p>
        </Tooltip>
      </h4>

      <div
        className={clsx(
          "display-flex flex-align-baseline margin-top-1 width-full font-sans-3xs",
        )}
      >
        <span className={clsx("minw-2")} />
        <input
          className={clsx(
            "usa-input height-auto text-right text-bold font-sans-xs",
            "margin-top-0 margin-right-05 padding-05 border-width-1px border-solid border-base-light",
          )}
          aria-label="Kilowatts"
          type="text"
          value={kw}
          onChange={(ev) => updateInputs(ev.target.value, "kw")}
        />
        <span className={clsx("minw-3")}> kW</span>
      </div>

      <div
        className={clsx(
          "display-flex flex-align-baseline margin-top-1 width-full font-sans-3xs",
        )}
      >
        <span className={clsx("minw-2")}>= </span>
        <input
          className={clsx(
            "usa-input height-auto text-right text-bold font-sans-xs",
            "margin-top-0 margin-right-05 padding-05 border-width-1px border-solid border-base-light",
          )}
          aria-label="Megawatts"
          type="text"
          value={mw}
          onChange={(ev) => updateInputs(ev.target.value, "mw")}
        />
        <span className={clsx("minw-3")}> MW</span>
      </div>

      <div
        className={clsx(
          "display-flex flex-align-baseline margin-top-1 width-full font-sans-3xs",
        )}
      >
        <span className={clsx("minw-2")}>= </span>
        <input
          className={clsx(
            "usa-input height-auto text-right text-bold font-sans-xs",
            "margin-top-0 margin-right-05 padding-05 border-width-1px border-solid border-base-light",
          )}
          aria-label="Gigawatts"
          type="text"
          value={gw}
          onChange={(ev) => updateInputs(ev.target.value, "gw")}
        />
        <span className={clsx("minw-3")}> GW</span>
      </div>

      {error && (
        <p
          className={clsx(
            "margin-top-105 margin-bottom-0 font-sans-2xs line-height-sans-2 text-bold text-secondary",
          )}
        >
          Please enter a positive number.
        </p>
      )}
    </div>
  );
}
