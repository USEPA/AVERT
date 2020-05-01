import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// reducers
import {
  MonthlyAggregation,
  MonthlyUnit,
  useMonthlyEmissionsState,
  selectMonthlyAggregation,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/redux/monthlyEmissions';
import { useRegionState } from 'app/redux/region';
// enums
import States from 'app/enums/States';
// styles
import './styles.css';

require('highcharts/modules/exporting')(Highcharts);

type Props = {
  heading: string;
};

function EmissionsChart({ heading }: Props) {
  const dispatch = useDispatch();
  const status = useMonthlyEmissionsState(({ status }) => status);
  const aggregation = useMonthlyEmissionsState(
    ({ aggregation }) => aggregation,
  );
  const unit = useMonthlyEmissionsState(({ unit }) => unit);
  const availableStates = useMonthlyEmissionsState(
    ({ availableStates }) => availableStates,
  );
  const availableCounties = useMonthlyEmissionsState(
    ({ availableCounties }) => availableCounties,
  );
  const selectedRegion = useRegionState(({ name }) => name);
  const selectedState = useMonthlyEmissionsState(
    ({ selectedState }) => selectedState,
  );
  const selectedCounty = useMonthlyEmissionsState(
    ({ selectedCounty }) => selectedCounty,
  );
  const output = useMonthlyEmissionsState(({ output }) => output);

  // rendering is ready when output prop has data
  const readyToRender = status === 'complete';

  // callback for after highcharts chart renders
  const afterRender = (chart: any) => {
    // as this entire react app is ultimately served in an iframe on another page,
    // this document has a click handler that sends document's height to other window,
    // which can then set the embedded iframe's height (see public/post-message.js)
    document.querySelector('html')?.click();
  };

  let aggregationFilter;
  if (readyToRender) {
    aggregationFilter = (
      <div className="avert-inline-select" id="geography-groups">
        <p>Select level of aggregation:</p>

        <label>
          <input
            type="radio"
            name="aggregation"
            value={'region'}
            checked={aggregation === 'region'}
            onChange={(ev) => {
              dispatch(
                selectMonthlyAggregation(ev.target.value as MonthlyAggregation),
              );
            }}
          />
          Region
        </label>

        <label>
          <input
            type="radio"
            name="aggregation"
            value={'state'}
            checked={aggregation === 'state'}
            onChange={(ev) => {
              dispatch(
                selectMonthlyAggregation(ev.target.value as MonthlyAggregation),
              );
              if (selectedState) {
                dispatch(selectMonthlyState(selectedState));
              }
            }}
          />
          State
        </label>

        <label>
          <input
            type="radio"
            name="aggregation"
            value={'county'}
            checked={aggregation === 'county'}
            onChange={(ev) => {
              dispatch(
                selectMonthlyAggregation(ev.target.value as MonthlyAggregation),
              );
              if (selectedCounty) {
                dispatch(selectMonthlyCounty(selectedCounty));
              }
            }}
          />
          County
        </label>
      </div>
    );
  }

  let StateSelector;
  if (aggregation === 'state' || aggregation === 'county') {
    StateSelector = (
      <div className="avert-select-group">
        <select
          value={selectedState}
          onChange={(ev) => dispatch(selectMonthlyState(ev.target.value))}
        >
          <option value="" disabled>
            Select State
          </option>

          {availableStates.map((state, index) => (
            <option key={index} value={state}>
              {States[state]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let CountySelector;
  if (aggregation === 'county') {
    CountySelector = (
      <div className="avert-select-group">
        <select
          value={selectedCounty}
          onChange={(ev) => dispatch(selectMonthlyCounty(ev.target.value))}
        >
          <option value="" disabled>
            Select County
          </option>

          {availableCounties.map((county, index) => (
            <option key={index} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let geographyFilter;
  if (readyToRender) {
    geographyFilter = (
      <div className="avert-geography-filter">
        {StateSelector}
        {CountySelector}
      </div>
    );
  }

  let unitFilter;
  if (readyToRender) {
    unitFilter = (
      <div className="avert-inline-select">
        <p>Select units:</p>

        <label>
          <input
            type="radio"
            name="unit"
            value={'emissions'}
            checked={unit === 'emissions'}
            onChange={(ev) =>
              dispatch(selectMonthlyUnit(ev.target.value as MonthlyUnit))
            }
          />
          Emission changes (lbs or tons)
        </label>

        <label>
          <input
            type="radio"
            name="unit"
            value={'percentages'}
            checked={unit === 'percentages'}
            onChange={(ev) =>
              dispatch(selectMonthlyUnit(ev.target.value as MonthlyUnit))
            }
          />
          Percent change
        </label>
      </div>
    );
  }

  // charts config
  const commonConfig: Highcharts.Options = {
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
      pointFormatter: function () {
        const dataPoint = this.y?.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

        const suffix =
          unit === 'emissions'
            ? ` ${(this.series.options as any).emissionsUnit}`
            : '%';

        return `<strong>${dataPoint}</strong>${suffix}`;
      },
    },
    lang: {
      contextButtonTitle: 'Export options',
    },
    exporting: {
      allowHTML: true,
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
  };

  // conditionally define location
  let location: string;

  if (aggregation === 'region') {
    location = `${selectedRegion} Region`;
  }

  if (aggregation === 'state') {
    location = selectedState === '' ? '' : `${States[selectedState]}`;
  }

  if (aggregation === 'county') {
    const countyName =
      selectedCounty.indexOf('(City)') !== -1
        ? selectedCounty // county is really a city
        : selectedState === 'LA'
        ? `${selectedCounty} Parish`
        : `${selectedCounty} County`;

    location =
      selectedCounty === '' ? '' : `${countyName}, ${States[selectedState]}`;
  }

  function formatTitle(pollutant: string) {
    return `<tspan class='avert-chart-title'>Change in ${pollutant} Emissions: ${location}</tspan>`;
  }

  function formatYAxis(emissionsUnit: string) {
    return unit === 'percentages'
      ? 'Percent change'
      : `Emission changes (${emissionsUnit})`;
  }

  const so2Config = {
    ...commonConfig,
    title: {
      text: formatTitle('SO<sub>2</sub>'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lbs'),
      },
    },
    series: [
      {
        name: 'SO₂',
        data: output.so2,
        color: '#058dc7',
        emissionsUnit: 'lbs',
      },
    ],
  };

  const noxConfig = {
    ...commonConfig,
    title: {
      text: formatTitle('NO<sub>X</sub>'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lbs'),
      },
    },
    series: [
      {
        name: 'NOₓ',
        data: output.nox,
        color: '#ed561b',
        emissionsUnit: 'lbs',
      },
    ],
  };

  const co2Config = {
    ...commonConfig,
    title: {
      text: formatTitle('CO<sub>2</sub>'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('tons'),
      },
    },
    series: [
      {
        name: 'CO₂',
        data: output.co2,
        color: '#50b432',
        emissionsUnit: 'tons',
      },
    ],
  };

  const pm25Config = {
    ...commonConfig,
    title: {
      text: formatTitle('PM<sub>2.5</sub>'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lbs'),
      },
    },
    series: [
      {
        name: 'PM₂₅',
        data: output.pm25,
        color: '#665683',
        emissionsUnit: 'lbs',
      },
    ],
  };

  let charts;
  if (readyToRender) {
    charts = (
      <div className="avert-emissions-charts">
        <HighchartsReact
          highcharts={Highcharts}
          options={so2Config}
          callback={afterRender}
        />

        <HighchartsReact
          highcharts={Highcharts}
          options={noxConfig}
          callback={afterRender}
        />

        <HighchartsReact
          highcharts={Highcharts}
          options={co2Config}
          callback={afterRender}
        />

        <HighchartsReact
          highcharts={Highcharts}
          options={pm25Config}
          callback={afterRender}
        />
      </div>
    );
  }

  return (
    <div className="avert-emissions-chart">
      <h3 className="avert-heading-three">{heading}</h3>

      {aggregationFilter}
      {geographyFilter}
      {unitFilter}
      {charts}
    </div>
  );
}

export default EmissionsChart;
