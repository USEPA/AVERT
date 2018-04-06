// @flow

import React from 'react';
// styles
import './styles.css';

type Props = {};

type State = {
  gw: number,
  mw: number,
  kw: number,
};

class UnitConversion extends React.Component<Props, State> {
  setGw: (number) => void;

  constructor(props: Props) {
    super(props);

    this.setGw = (value) => {
      this.setState((prevState) => ({ ...prevState, gw: value }));
    };

    this.state = {
      gw: 1,
      mw: 1000,
      kw: 1000000,
    };
  }

  render() {
    return (
      <div className="avert-unit-conversion">
        <p>Unit conversions:</p>

        <div className="avert-unit-conversion-fields">
          <div className="avert-unit-conversion-field">
            <input
              type="text"
              value={this.state.gw}
              onChange={(event) => this.setGw(Number(event.target.value))}
            />
            <span> GW = </span>
          </div>

          <div className="avert-unit-conversion-field">
            <input
              type="text"
              value={this.state.gw * 1000}
              onChange={(event) =>
                this.setGw(Number(event.target.value) / 1000)
              }
            />
            <span> MW = </span>
          </div>

          <div className="avert-unit-conversion-field">
            <input
              type="text"
              value={this.state.gw * 1000000}
              onChange={(event) =>
                this.setGw(Number(event.target.value) / 1000000)
              }
            />
            <span> kW</span>
          </div>
        </div>
      </div>
    );
  }
}

export default UnitConversion;
