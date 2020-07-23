/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import {
  MonthlyAggregation,
  MonthlyUnit,
  selectMonthlyAggregation,
  selectMonthlyUnit,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/redux/reducers/monthlyEmissions';
// hooks
import { useSelectedRegion } from 'app/hooks';
// config
import { StateId, states } from 'app/config';

require('highcharts/modules/exporting')(Highcharts);

const filterGroupStyles = css`
  overflow: hidden;
  margin-bottom: 1rem;

  label {
    display: block;
    margin-left: 0.75rem;

    @media (min-width: 25em) {
      display: inline-block;
    }
  }

  input {
    margin-right: 0.375rem;
  }
`;

const filterTextStyles = css`
  margin-top: 0;

  @media (min-width: 35em) {
    display: inline-block;
  }
`;

const geographyFilterStyles = css`
  overflow: hidden;
`;

const selectGroupStyles = css`
  float: left;
  margin: 0 0.5rem 1rem;
  width: calc(50% - 1rem);

  select {
    width: 100%;
  }
`;

const emissionsChartsStyles = css`
  padding: 1rem;
  border: 1px solid #aaa;

  [data-highcharts-chart] {
    margin-bottom: 1rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

function EmissionsChart() {
  const dispatch = useDispatch();
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const aggregation = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.aggregation,
  );
  const unit = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.unit,
  );
  const selectedStateId = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.selectedStateId,
  );
  const selectedCountyName = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.selectedCountyName,
  );
  const availableStates = useTypedSelector(({ displacement }) => {
    return Object.keys(displacement.statesAndCounties).sort();
  });
  const availableCounties = useTypedSelector(({ displacement }) => {
    return displacement.statesAndCounties[selectedStateId as StateId]?.sort();
  });
  const so2Data = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.output.so2,
  );
  const noxData = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.output.nox,
  );
  const co2Data = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.output.co2,
  );
  const pm25Data = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.output.pm25,
  );

  // TODO: determine how to handle when multiple regions are selected
  const region = useSelectedRegion();
  const regionName = region?.name;

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
      <div css={filterGroupStyles}>
        <p css={filterTextStyles}>Select level of aggregation:</p>

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
              if (selectedStateId) {
                dispatch(selectMonthlyState(selectedStateId));
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
              if (selectedCountyName) {
                dispatch(selectMonthlyCounty(selectedCountyName));
              }
            }}
          />
          County
        </label>
      </div>
    );
  }

  let stateSelect;
  if (aggregation === 'state' || aggregation === 'county') {
    stateSelect = (
      <div css={selectGroupStyles}>
        <select
          value={selectedStateId}
          onChange={(ev) => dispatch(selectMonthlyState(ev.target.value))}
        >
          <option value="" disabled>
            Select State
          </option>

          {availableStates.map((stateId) => {
            return (
              <React.Fragment key={stateId}>
                <option value={stateId}>
                  {states[stateId as StateId].name}
                </option>
              </React.Fragment>
            );
          })}
        </select>
      </div>
    );
  }

  let countySelect;
  if (aggregation === 'county') {
    countySelect = (
      <div css={selectGroupStyles}>
        <select
          value={selectedCountyName}
          onChange={(ev) => dispatch(selectMonthlyCounty(ev.target.value))}
        >
          <option value="" disabled>
            Select County
          </option>

          {availableCounties?.map((county, index) => (
            <option key={index} value={county}>
              {/* format 'city' if found in county name */}
              {county.replace(/city/, '(City)')}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let geographyFilter;
  if (readyToRender) {
    geographyFilter = (
      <div css={geographyFilterStyles}>
        {stateSelect}
        {countySelect}
      </div>
    );
  }

  let unitFilter;
  if (readyToRender) {
    unitFilter = (
      <div css={filterGroupStyles}>
        <p css={filterTextStyles}>Select units:</p>

        <label>
          <input
            type="radio"
            name="unit"
            value={'emissions'}
            checked={unit === 'emissions'}
            onChange={(ev) => {
              dispatch(selectMonthlyUnit(ev.target.value as MonthlyUnit));
            }}
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

  // format 'city' if found in county name
  const countyName = selectedCountyName.replace(/city/, '(City)');

  // conditionally define location based on aggregation
  const location =
    aggregation === 'region'
      ? `${regionName} Region`
      : aggregation === 'state'
      ? selectedStateId === ''
        ? ''
        : `${states[selectedStateId as StateId].name}`
      : aggregation === 'county'
      ? selectedCountyName === ''
        ? ''
        : `${countyName}, ${states[selectedStateId as StateId].name}`
      : '';

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
        data: so2Data,
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
        data: noxData,
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
        data: co2Data,
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
        data: pm25Data,
        color: '#665683',
        emissionsUnit: 'lbs',
      },
    ],
  };

  let charts;
  if (readyToRender) {
    charts = (
      <div css={emissionsChartsStyles} className="avert-emissions-charts">
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
    <React.Fragment>
      {aggregationFilter}
      {geographyFilter}
      {unitFilter}
      {charts}
    </React.Fragment>
  );
}

export default EmissionsChart;
