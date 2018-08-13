// @flow

import React from 'react';
// components
import Tooltip from 'app/components/Tooltip/container.js';
// styles
import './styles.css';

type Props = {};

type State = {
  error: boolean,
  gw: string,
  mw: string,
  kw: string,
};

class UnitConversion extends React.Component<Props, State> {
  updateInputs: (string, string) => void;

  constructor(props: Props) {
    super(props);

    this.updateInputs = (value, unit) => {
      const input = Number(value);
      if (isNaN(input) || input < 0) {
        this.setState((prevState) => ({ ...prevState, error: true }));
        return;
      }

      const factor = 1000;
      const computed = {};
      computed[unit] = value;

      if (unit === 'gw') {
        computed.mw = (input * factor).toString();
        computed.kw = (input * factor * factor).toString();
      }

      if (unit === 'mw') {
        computed.gw = (input / factor).toString();
        computed.kw = (input * factor).toString();
      }

      if (unit === 'kw') {
        computed.gw = (input / factor / factor).toString();
        computed.mw = (input / factor).toString();
      }

      this.setState((prevState) => ({
        ...prevState,
        error: false,
        gw: computed.gw,
        mw: computed.mw,
        kw: computed.kw,
      }));
    };

    this.state = {
      error: false,
      gw: '1',
      mw: '1000',
      kw: '1000000',
    };
  }

  render() {
    return (
      <div className="avert-unit-conversion">
        <p>
          <span className="avert-unit-conversion-heading">
            Helpful Unit Conversions
          </span>{' '}
          <Tooltip id={9}>
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
        </p>

        <div className="avert-unit-fields">
          <div className="avert-unit-field">
            <span className="avert-field-prefix" />
            <input
              type="text"
              value={this.state.kw}
              onChange={(e) => this.updateInputs(e.target.value, 'kw')}
            />
            <span className="avert-field-postfix"> kW</span>
          </div>

          <div className="avert-unit-field">
            <span className="avert-field-prefix">= </span>
            <input
              type="text"
              value={this.state.mw}
              onChange={(e) => this.updateInputs(e.target.value, 'mw')}
            />
            <span className="avert-field-postfix"> MW</span>
          </div>

          <div className="avert-unit-field">
            <span className="avert-field-prefix">= </span>
            <input
              type="text"
              value={this.state.gw}
              onChange={(e) => this.updateInputs(e.target.value, 'gw')}
            />
            <span className="avert-field-postfix"> GW</span>
          </div>
        </div>

        {this.state.error && (
          <p className="avert-input-error">Please enter a positive number.</p>
        )}
      </div>
    );
  }
}

export default UnitConversion;
