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
        <p>Helpful Unit conversions:</p>

        <div className="avert-unit-fields">
          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.kw}
              onChange={(e) => this.updateInputs(e.target.value, 'kw')}
            />
            <span className="avert-unit-field-text"> kW</span>

            <Tooltip id={8}>
              To convert <strong>kWh</strong> to <strong>kW</strong>, divide kWh
              by the <em>total number of hours in the year</em>
              <sup>*</sup>.
              <br />
              <br />
              <sup>*</sup>Non-leap years: <strong>8760</strong> hours
              <br />
              <sup>*</sup>Leap years: <strong>8784</strong> hours
              <br />
              <br />
              <strong>2016 (leap-year) example:</strong>
              <br />
              8784 kWh ÷ 8784 hrs = 1 kW
            </Tooltip>

            <span className="avert-unit-field-text">= </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.mw}
              onChange={(e) => this.updateInputs(e.target.value, 'mw')}
            />
            <span className="avert-unit-field-text"> MW = </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.gw}
              onChange={(e) => this.updateInputs(e.target.value, 'gw')}
            />
            <span className="avert-unit-field-text"> GW</span>

            <Tooltip id={9}>
              To convert <strong>GW</strong> to <strong>GWh</strong>, multiply
              GW by the <em>total number of hours in the year</em>
              <sup>*</sup>.
              <br />
              <br />
              <sup>*</sup>Non-leap years: <strong>8760</strong> hours
              <br />
              <sup>*</sup>Leap years: <strong>8784</strong> hours
              <br />
              <br />
              <strong>2016 (leap-year) example:</strong>
              <br />
              1 GW × 8784 hrs = 8784 GWh
            </Tooltip>
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
