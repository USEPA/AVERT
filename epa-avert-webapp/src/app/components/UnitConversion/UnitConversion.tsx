import React from 'react';
// components
import Tooltip from 'app/components/Tooltip/Tooltip';
// styles
import './styles.css';

function UnitConversion() {
  const [error, setError] = React.useState(false);
  const [kw, setKw] = React.useState(1000000);
  const [mw, setMw] = React.useState(1000);
  const [gw, setGw] = React.useState(1);

  function updateInputs(value: string, unit: 'kw' | 'mw' | 'gw') {
    const input = Number(value);

    if (isNaN(input) || input < 0) {
      setError(true);
      return;
    }

    const factor = 1000;
    const computed = { kw, mw, gw };
    computed[unit] = input;

    if (unit === 'gw') {
      computed.mw = input * factor;
      computed.kw = input * factor * factor;
    }

    if (unit === 'mw') {
      computed.gw = input / factor;
      computed.kw = input * factor;
    }

    if (unit === 'kw') {
      computed.gw = input / factor / factor;
      computed.mw = input / factor;
    }

    setGw(computed.gw);
    setMw(computed.mw);
    setKw(computed.kw);
  }

  return (
    <div className="avert-unit-conversion">
      <p>
        <span className="avert-unit-conversion-heading">
          Helpful Unit Conversions
        </span>{' '}
        <Tooltip id={20}>
          To convert units from power (<strong>kW, MW, GW</strong>) to energy (
          <strong>kWh, MWh, GWh</strong>), multiply by the total number of hours
          in the year. To convert in the other direction, divide by the total
          number of hours in the year. There are <strong>8,760 hours</strong> in
          a non-leap year and <strong>8,784 hours</strong> in a leap year.
          <br />
          <br />
          <strong>
            Example: converting energy to power for 2016 (leap year):
          </strong>
          <br />
          10,000 kWh ÷ 8,784 h = 1.14 kW
        </Tooltip>
      </p>

      <div className="avert-unit-fields">
        <div className="avert-unit-field">
          <span className="avert-field-prefix" />
          <input
            type="text"
            value={kw}
            onChange={(ev) => updateInputs(ev.target.value, 'kw')}
          />
          <span className="avert-field-postfix"> kW</span>
        </div>

        <div className="avert-unit-field">
          <span className="avert-field-prefix">= </span>
          <input
            type="text"
            value={mw}
            onChange={(ev) => updateInputs(ev.target.value, 'mw')}
          />
          <span className="avert-field-postfix"> MW</span>
        </div>

        <div className="avert-unit-field">
          <span className="avert-field-prefix">= </span>
          <input
            type="text"
            value={gw}
            onChange={(ev) => updateInputs(ev.target.value, 'gw')}
          />
          <span className="avert-field-postfix"> GW</span>
        </div>
      </div>

      {error && (
        <p className="avert-input-error">Please enter a positive number.</p>
      )}
    </div>
  );
}

export default UnitConversion;
