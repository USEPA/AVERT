import React, { Component, PropTypes } from 'react';
// styles
import './styles.css';

class EmissionsChart extends Component {
  render() {
    // conditionally define stateSelector, if aggrigation is State or County
    let stateSelector;

    if (this.props.aggregation === 'State' ||
        this.props.aggregation === 'County') {
      stateSelector = (
        <div className='avert-select-group' id='geography-state'>
          <select value={ this.props.selectedState }>
            <option value='' disabled>Select State</option>
            <option value='state-one'>(state)</option>
            <option value='state-one'>(state)</option>
          </select>
        </div>
      );
    }

    // conditionally define countySelector, if aggrigation is County
    let countySelector;

    if (this.props.aggregation === 'County') {
      countySelector = (
        <div className='avert-select-group' id='geography-county'>
          <select value={ this.props.selectedCounty }>
            <option value='' disabled>Select County</option>
            <option value='county-one'>(county)</option>
            <option value='county-one'>(county)</option>
          </select>
        </div>
      )
    }

    return (
      <div className='avert-emissions-chart'>
        <h3 className='avert-heading-three'>{ this.props.heading }</h3>

        <div className='avert-inline-select' id='geography-groups'>
          <p>Select level of aggregation:</p>

          <label>
            <input type='radio' name='aggregation' value='Region'
              checked={ this.props.aggregation === 'Region' }
              onChange={(e) => {
                this.props.onAggregationRadioChange(e.target.value);
              }}
            />
            Region
          </label>

          <label>
            <input type='radio' name='aggregation' value='State'
              checked={ this.props.aggregation === 'State' }
              onChange={(e) => {
                this.props.onAggregationRadioChange(e.target.value);
              }}
            />
            State
          </label>

          <label>
            <input type='radio' name='aggregation' value='County'
              checked={ this.props.aggregation === 'County' }
              onChange={(e) => {
                this.props.onAggregationRadioChange(e.target.value);
              }}
            />
            County
          </label>
        </div>

        <div className='avert-geography-filter'>
          { stateSelector }
          { countySelector }
        </div>

        <div className='avert-inline-select'>
          <p>Select units:</p>

          <label>
            <input type='radio' name='unit' value='Emission changes'
              checked={ this.props.unit === 'Emission changes' }
              onChange={(e) => {
                this.props.onUnitRadioChange(e.target.value);
              }}
            />
            Emission changes (lbs or tons)
          </label>

          <label>
            <input type='radio' name='unit' value='Percent change'
              checked={ this.props.unit === 'Percent change' }
              onChange={(e) => {
                this.props.onUnitRadioChange(e.target.value);
              }}
            />
            Percent change
          </label>
        </div>

        <div className='avert-geography-chart'>
          <img src='//www.placehold.it/670x300' alt='' />
        </div>
      </div>
    )
  }
};

EmissionsChart.propTypes = {
  heading: PropTypes.string.isRequired,
  aggregation: PropTypes.string.isRequired,
  onAggregationRadioChange: PropTypes.func.isRequired,
  onUnitRadioChange: PropTypes.func.isRequired,
};

export default EmissionsChart;
