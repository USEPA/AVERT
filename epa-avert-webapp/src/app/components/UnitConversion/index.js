// @flow

import React from 'react';
// styles
import './styles.css';

type Props = {};

type State = {
  error: boolean,
  gw: number,
  mw: number,
  kw: number,
};

class UnitConversion extends React.Component<Props, State> {
  gwFactor: number;
  mwFactor: number;
  kwFactor: number;
  setGw: (string, number) => void;

  constructor(props: Props) {
    super(props);

    this.gwFactor = 1;
    this.mwFactor = 1000;
    this.kwFactor = 1000000;

    this.setGw = (value, factor) => {
      if (Number(value) >= 0) {
        this.setState((prevState) => ({
          ...prevState,
          error: false,
          gw: Number(value) / factor,
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          error: true,
        }));
      }
    };

    this.state = {
      error: false,
      gw: this.gwFactor,
      mw: this.mwFactor,
      kw: this.kwFactor,
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
              value={this.state.gw * this.gwFactor}
              onChange={(e) => this.setGw(e.target.value, this.gwFactor)}
            />
            <span> GW = </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.gw * this.mwFactor}
              onChange={(e) => this.setGw(e.target.value, this.mwFactor)}
            />
            <span> MW = </span>
          </div>

          <div className="avert-unit-field">
            <input
              type="text"
              value={this.state.gw * this.kwFactor}
              onChange={(e) => this.setGw(e.target.value, this.kwFactor)}
            />
            <span> kW</span>
          </div>
        </div>

        {this.state.error && (
          <p class="avert-input-error">Please enter a positive number.</p>
        )}
      </div>
    );
  }
}

export default UnitConversion;
