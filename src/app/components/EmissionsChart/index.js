import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
import { StatusEnum } from '../../utils/StatusEnum';
import { AggregationEnum } from '../../utils/AggregationEnum';
import { MonthlyUnitEnum } from '../../utils/MonthlyUnitEnum';
// styles
import './styles.css';

const EmissionsChart = ({
  heading,
  selected_region,
  reselectRegion,
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
  monthly_status,
}) => {
  // rendering is ready when output prop has data
  const readyToRender = monthly_status === StatusEnum.DONE;

  let aggregationFilter = null;
  if (readyToRender) {
    aggregationFilter = (
      <div className='avert-inline-select' id='geography-groups'>
        <p>{'Select level of aggregation:'}</p>

        <label>
          <input
            type='radio'
            name='aggregation'
            value={ AggregationEnum.REGION }
            checked={ aggregation === AggregationEnum.REGION }
            onChange={(e) => {
              onAggregationChange(e.target.value);
              reselectRegion(selected_region);
            }}
          />
          Region
        </label>

        <label>
          <input
            type='radio'
            name='aggregation'
            value={ AggregationEnum.STATE }
            checked={ aggregation === AggregationEnum.STATE }
            onChange={(e) => {
              onAggregationChange(e.target.value);
              if (selected_state) { selectState(selected_state) }
            }}
          />
          State
        </label>

        <label>
          <input
            type='radio'
            name='aggregation'
            value={ AggregationEnum.COUNTY }
            checked={ aggregation === AggregationEnum.COUNTY }
            onChange={(e) => {
              onAggregationChange(e.target.value);
              if (selected_county) { selectCounty(selected_county) }
            }}
          />
          County
        </label>
      </div>
    );
  }

  let stateSelector = null;
  if (aggregation === AggregationEnum.STATE || aggregation === AggregationEnum.COUNTY) {
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

  let countySelector = null;
  if (aggregation === AggregationEnum.COUNTY) {
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

  let geographyFilter = null;
  if (readyToRender) {
    geographyFilter = (
      <div className='avert-geography-filter'>
        { stateSelector }
        { countySelector }
      </div>
    );
  }

  let unitFilter = null;
  if (readyToRender) {
    unitFilter = (
      <div className='avert-inline-select'>
        <p>{'Select units:'}</p>

        <label>
          <input
            type='radio'
            name='unit'
            value={MonthlyUnitEnum.EMISSION}
            checked={ unit === MonthlyUnitEnum.EMISSION }
            onChange={(e) => onUnitChange(e.target.value)}
          />
          Emission changes (lbs or tons)
        </label>

        <label>
          <input
            type='radio'
            name='unit'
            value={MonthlyUnitEnum.PERCENT_CHANGE}
            checked={ unit === MonthlyUnitEnum.PERCENT_CHANGE }
            onChange={(e) => onUnitChange(e.target.value)}
          />
          Percent change
        </label>
      </div>
    );
  }

  // charts data
  const so2_data = output.so2.map((emission) => emission);
  const nox_data = output.nox.map((emission) => emission);
  const co2_data = output.co2.map((emission) => emission);

  // const so2_data = [];
  // const nox_data = [];
  // const co2_data = [];

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

  let chart = null;
  if (readyToRender) {
    chart = (
      <div className="avert-emissions-charts">
        <Highcharts config={so2_config} />
        <Highcharts config={nox_config} />
        <Highcharts config={co2_config} />
      </div>
    );
  }

  return (
    <div className='avert-emissions-chart'>
      <h3 className='avert-heading-three'>{ heading }</h3>

      { aggregationFilter }
      { geographyFilter }
      { unitFilter }

      { chart }
    </div>
  );
};

EmissionsChart.propTypes = {
  heading: PropTypes.string.isRequired,
  reselectRegion: PropTypes.func.isRequired,
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
