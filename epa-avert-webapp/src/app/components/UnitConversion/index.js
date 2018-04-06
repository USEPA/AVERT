// @flow

import React from 'react';
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
        <p>Unit conversions:</p>

        <div className="avert-unit-fields">
          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.gw}
              onChange={(e) => this.updateInputs(e.target.value, 'gw')}
            />
            <span> GW = </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.mw}
              onChange={(e) => this.updateInputs(e.target.value, 'mw')}
            />
            <span> MW = </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.kw}
              onChange={(e) => this.updateInputs(e.target.value, 'kw')}
            />
            <span> kW</span>
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
