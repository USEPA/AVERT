/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { css } from '@emotion/react';
// components
import Tooltip from 'app/components/Tooltip';
import { inputErrorStyles } from 'app/components/EEREInputs';

const unitConversionStyles = css`
  margin-bottom: 1rem;
  padding: 0.5rem 0.625rem 0.75rem;
  border: 1px solid #dbdbdb;
  background-color: #fbfbfb;

  @media (min-width: 30em) {
    float: right;
    margin-left: 1rem;
    width: calc(100% / 3);
  }
`;

const textStyles = css`
  margin: 0;
  line-height: 1;
  text-align: center;
`;

const headingStyles = css`
  font-size: 0.8125rem;
  font-weight: bold;
`;

// override inherited textStyles
const modalStyles = css`
  line-height: 1.375;
  text-align: left;
`;

const unitGroupStyles = css`
  display: flex;
  align-items: baseline;
  margin-top: 0.5rem;
  width: 100%;
`;

const unitPrefixStyles = css`
  flex: 1 0 auto;
  min-width: 0.5rem;
  font-size: 0.75rem;
`;

const unitPostfixStyles = css`
  flex: 1 0 auto;
  min-width: 1.5rem;
  font-size: 0.75rem;
`;

const unitInputStyles = css`
  margin: 0 0.25rem;
  padding: 0.125rem 0.25rem;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 0.8125rem;
  font-weight: bold;
  text-align: right;
`;

const errorStyles = css`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
  font-style: normal;
`;

function UnitConversion() {
  const [error, setError] = useState(false);
  const [kw, setKw] = useState(1e6);
  const [mw, setMw] = useState(1e3);
  const [gw, setGw] = useState(1);

  function updateInputs(value: string, unit: 'kw' | 'mw' | 'gw') {
    const input = Number(value);

    if (isNaN(input) || input < 0) {
      setError(true);
      return;
    }

    const factor = 1e3;
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

    setError(false);
    setKw(computed.kw);
    setMw(computed.mw);
    setGw(computed.gw);
  }

  return (
    <div css={unitConversionStyles}>
      <p css={textStyles}>
        <span css={headingStyles}>Helpful Unit Conversions</span>{' '}
        <span css={modalStyles}>
          <Tooltip id={20}>
            To convert units from power (<strong>kW, MW, GW</strong>) to energy
            (<strong>kWh, MWh, GWh</strong>), multiply by the total number of
            hours in the year. To convert in the other direction, divide by the
            total number of hours in the year. There are{' '}
            <strong>8,760 hours</strong> in a non-leap year and{' '}
            <strong>8,784 hours</strong> in a leap year.
            <br />
            <br />
            <strong>
              Example: converting energy to power for 2016 (leap year):
            </strong>
            <br />
            10,000 kWh ÷ 8,784 h = 1.14 kW
          </Tooltip>
        </span>
      </p>

      <div css={unitGroupStyles}>
        <span css={unitPrefixStyles} />
        <input
          css={unitInputStyles}
          aria-label="Kilowatts"
          type="text"
          value={kw}
          onChange={(ev) => updateInputs(ev.target.value, 'kw')}
        />
        <span css={unitPostfixStyles}> kW</span>
      </div>

      <div css={unitGroupStyles}>
        <span css={unitPrefixStyles}>= </span>
        <input
          css={unitInputStyles}
          aria-label="Megawatts"
          type="text"
          value={mw}
          onChange={(ev) => updateInputs(ev.target.value, 'mw')}
        />
        <span css={unitPostfixStyles}> MW</span>
      </div>

      <div css={unitGroupStyles}>
        <span css={unitPrefixStyles}>= </span>
        <input
          css={unitInputStyles}
          aria-label="Gigawatts"
          type="text"
          value={gw}
          onChange={(ev) => updateInputs(ev.target.value, 'gw')}
        />
        <span css={unitPostfixStyles}> GW</span>
      </div>

      {error && (
        <p css={[inputErrorStyles, errorStyles]}>
          Please enter a positive number.
        </p>
      )}
    </div>
  );
}

export default UnitConversion;
