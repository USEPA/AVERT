import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// styles
import './styles.css';

const EmissionsChart = ({
  heading,
  selected_state,
  selectState,
  available_states,
  selected_county,
  selectCounty,
  available_counties,
  aggregation,
  onAggregationChange,
  unit,
  onUnitChange,
  output,
}) => {
  // conditionally define stateSelector, if aggrigation is State or County
  let stateSelector;
  if (aggregation === 'state' || aggregation === 'county') {
    stateSelector = (
      <div className='avert-select-group'>
        <select
          value={ selected_state }
          onChange={(e) => selectState(e.target.value)}
        >
          <option value='' disabled>Select State</option>

          {available_states.map((state, index) => {
            return <option key={ index } value={ state }>{ state }</option>
          })}
        </select>
      </div>
    );
  }

  // conditionally define countySelector, if aggrigation is County
  let countySelector;
  if (aggregation === 'county') {
    countySelector = (
      <div className='avert-select-group'>
        <select
          value={ selected_county }
          onChange={(e) => selectCounty(e.target.value)}
        >
          <option value='' disabled>Select County</option>

          {available_counties.map((county, index) => {
            return <option key={ index } value={ county }>{ county }</option>
          })}
        </select>
      </div>
    )
  }

  // charts data
  const so2_data = output.so2.map((emission) => emission);
  const nox_data = output.nox.map((emission) => emission);
  const co2_data = output.co2.map((emission) => emission);

  // charts config
  const shared_config = {
    chart: {
      type: 'column',
      height: 240,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };
  const so2_config = {
    ...shared_config,
    title: {
      text: 'SO₂',
    },
    yAxis: {
      title: {
        text: 'Emission changes (lbs)',
      },
    },
    series: [{
      name: 'SO₂',
      data: so2_data,
      color: '#058dc7',
    }],
  };
  const nox_config = {
    ...shared_config,
    title: {
      text: 'NOₓ',
    },
    yAxis: {
      title: {
        text: 'Emission changes (lbs)',
      },
    },
    series: [{
      name: 'NOₓ',
      data: nox_data,
      color: '#ed561b',
    }]
  };
  const co2_config = {
    ...shared_config,
    title: {
      text: 'CO₂',
    },
    yAxis: {
      title: {
        text: 'Emission changes (tons)',
      },
    },
    series: [{
      name: 'CO₂',
      data: co2_data,
      color: '#50b432',
    }]
  };

  return (
    <div className='avert-emissions-chart'>
      <h3 className='avert-heading-three'>{ heading }</h3>

      <div className='avert-inline-select' id='geography-groups'>
        <p>{'Select level of aggregation:'}</p>

        <label>
          <input
            type='radio'
            name='aggregation'
            value='region'
            checked={ aggregation === 'region' }
            onChange={(e) => onAggregationChange(e.target.value)}
          />
          Region
        </label>

        <label>
          <input
            type='radio'
            name='aggregation'
            value='state'
            checked={ aggregation === 'state' }
            onChange={(e) => onAggregationChange(e.target.value)}
          />
          State
        </label>

        <label>
          <input
            type='radio'
            name='aggregation'
            value='county'
            checked={ aggregation === 'county' }
            onChange={(e) => onAggregationChange(e.target.value)}
          />
          County
        </label>
      </div>

      <div className='avert-geography-filter'>
        { stateSelector }
        { countySelector }
      </div>

      <div className='avert-inline-select'>
        <p>{'Select units:'}</p>

        <label>
          <input
            type='radio'
            name='unit'
            value='emission'
            checked={ unit === 'emission' }
            onChange={(e) => onUnitChange(e.target.value)}
          />
          Emission changes (lbs or tons)
        </label>

        <label>
          <input
            type='radio'
            name='unit'
            value='percent'
            checked={ unit === 'percent' }
            onChange={(e) => onUnitChange(e.target.value)}
          />
          Percent change
        </label>
      </div>

      <div className="avert-emissions-charts">
        <Highcharts config={so2_config} />
        <Highcharts config={nox_config} />
        <Highcharts config={co2_config} />
      </div>
    </div>
  );
};

EmissionsChart.propTypes = {
  heading: PropTypes.string.isRequired,
  //selected_state: PropTypes.string.isRequired,
  selectState: PropTypes.func.isRequired,
  available_states: PropTypes.array.isRequired,
  //selected_county: PropTypes.string.isRequired,
  selectCounty: PropTypes.func.isRequired,
  available_counties: PropTypes.array.isRequired,
  aggregation: PropTypes.string.isRequired,
  onAggregationChange: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  output: PropTypes.object.isRequired,
};

export default EmissionsChart;
