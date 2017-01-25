import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// utilities
import Regions from '../../utils/Regions';
import { StatusEnum } from '../../utils/StatusEnum';
import { AggregationEnum } from '../../utils/AggregationEnum';
import { MonthlyUnitEnum } from '../../utils/MonthlyUnitEnum';
import StatesEnum from '../../utils/StatesEnum';;
// styles
import './styles.css';

const EmissionsChart = ({
  heading,
  selected_region,
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
            return <option key={ index } value={ state }>{ StatesEnum[state] }</option>
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
    tooltip: {
      // pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      pointFormatter: function() {
        return (
          '<span style="color:' + this.color + '">\u25CF</span> ' +
          this.series.yAxis.axisTitle.textStr + ': ' +
          '<b>' + Math.round(this.y).toLocaleString() + '</b><br/>'
        )
      },
    },
    lang: {
      hoverText: 'Export options',
    },
    exporting: {
      buttons: {
        contextButton: {
          _titleKey: 'hoverText',
        },
      },
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  };

  const regionName = selected_region === 0 ?
    'Unspecified' :
    Object.keys(Regions)
      .map(r => Regions[r])
      .filter(r => r.id === selected_region)[0].label;

  let titleAggregation;
  if (aggregation === AggregationEnum.REGION) {
    titleAggregation = `${regionName} Region`;
  }
  if (aggregation === AggregationEnum.STATE) {
    titleAggregation = selected_state === '' ?
      '' :
      `${StatesEnum[selected_state]}`;
  }
  if (aggregation === AggregationEnum.COUNTY) {
    // counties are called parishes in Louisiana
    const countyWord = StatesEnum[selected_state] === 'Louisiana' ? 'Parish' : 'County';
    titleAggregation = selected_county === '' ?
      '' :
      `${selected_county} ${countyWord}, ${StatesEnum[selected_state]}`;
  }

  const titleText = (titleChemical) => {
    return `Change in ${titleChemical} Emissions: ${titleAggregation}`
  };

  const so2_config = {
    ...shared_config,
    title: {
      text: `<tspan class='avert-chart-title'>${titleText('SO<sub>2</sub>')}</tspan>`,
      useHTML: true,
    },
    yAxis: {
      title: {
        text: unit === MonthlyUnitEnum.PERCENT_CHANGE ? 'Percent change' : 'Emission changes (lbs)',
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
      text: `<tspan class='avert-chart-title'>${titleText('NO<sub>X</sub>')}</tspan>`,
      useHTML: true,
    },
    yAxis: {
      title: {
        text: unit === MonthlyUnitEnum.PERCENT_CHANGE ? 'Percent change' : 'Emission changes (lbs)',
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
      text: `<tspan class='avert-chart-title'>${titleText('CO<sub>2</sub>')}</tspan>`,
      useHTML: true,
    },
    yAxis: {
      title: {
        text: unit === MonthlyUnitEnum.PERCENT_CHANGE ? 'Percent change' : 'Emission changes (tons)',
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
  //monthly_status: PropTypes.string.isRequired,
};

export default EmissionsChart;
