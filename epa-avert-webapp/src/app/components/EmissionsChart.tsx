/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { calculateMonthlyData } from 'app/redux/reducers/displacement';
import {
  MonthlyAggregation,
  MonthlyUnit,
  selectMonthlyAggregation,
  selectMonthlyUnit,
  selectMonthlyRegion,
  selectMonthlyState,
  selectMonthlyCounty,
} from 'app/redux/reducers/monthlyEmissions';
// hooks
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';
// config
import { RegionId, StateId, regions, states } from 'app/config';

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
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const selectedAggregation = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.selectedAggregation,
  );
  const selectedUnit = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.selectedUnit,
  );
  const selectedRegionId = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.selectedRegionId,
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
  const filteredMonthlyData = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.filteredMonthlyData,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  // callback for after highcharts chart renders
  function afterRender(chart: any) {
    // as this entire react app is ultimately served in an iframe on another page,
    // this document has a click handler that sends document's height to other window,
    // which can then set the embedded iframe's height (see public/post-message.js)
    document.querySelector('html')?.click();
  }

  if (status !== 'complete') return null;

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
          selectedUnit === 'emissions'
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

  const selectedStateRegionNames =
    selectedRegionId === 'ALL'
      ? `${selectedStateRegions
          .map((region) => regions[region.id]?.name)
          .join(', ')} Regions`
      : `${regions[selectedRegionId as RegionId]?.name} Region`;

  const chartLocationText =
    selectedAggregation === 'region'
      ? geographicFocus === 'regions'
        ? `${selectedRegion?.name} Region`
        : selectedStateRegionNames
      : selectedAggregation === 'state'
      ? selectedStateId === ''
        ? ''
        : `${states[selectedStateId as StateId].name}`
      : selectedAggregation === 'county'
      ? selectedCountyName === ''
        ? ''
        : `${countyName}, ${states[selectedStateId as StateId].name}`
      : '';

  function formatTitle(pollutant: string) {
    return `<tspan class='avert-chart-title'>Change in ${pollutant} Emissions: ${chartLocationText}</tspan>`;
  }

  function formatYAxis(emissionsUnit: string) {
    return selectedUnit === 'percentages'
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
        data: calculateMonthlyData(filteredMonthlyData.so2, selectedUnit),
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
        data: calculateMonthlyData(filteredMonthlyData.nox, selectedUnit),
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
        data: calculateMonthlyData(filteredMonthlyData.co2, selectedUnit),
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
        data: calculateMonthlyData(filteredMonthlyData.pm25, selectedUnit),
        color: '#665683',
        emissionsUnit: 'lbs',
      },
    ],
  };

  return (
    <React.Fragment>
      <div css={filterGroupStyles}>
        <p css={filterTextStyles}>Select level of aggregation:</p>

        <label>
          <input
            type="radio"
            name="aggregation"
            value={'region'}
            checked={selectedAggregation === 'region'}
            onChange={(ev) => {
              const aggregation = ev.target.value as MonthlyAggregation;
              dispatch(selectMonthlyAggregation(aggregation));
            }}
          />
          Region
        </label>

        <label>
          <input
            type="radio"
            name="aggregation"
            value={'state'}
            checked={selectedAggregation === 'state'}
            onChange={(ev) => {
              const aggregation = ev.target.value as MonthlyAggregation;
              dispatch(selectMonthlyAggregation(aggregation));
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
            checked={selectedAggregation === 'county'}
            onChange={(ev) => {
              const aggregation = ev.target.value as MonthlyAggregation;
              dispatch(selectMonthlyAggregation(aggregation));
              if (selectedCountyName) {
                dispatch(selectMonthlyCounty(selectedCountyName));
              }
            }}
          />
          County
        </label>
      </div>

      <div css={geographyFilterStyles}>
        {geographicFocus === 'states' && selectedAggregation === 'region' && (
          <div css={selectGroupStyles}>
            <select
              value={selectedRegionId}
              onChange={(ev) => dispatch(selectMonthlyRegion(ev.target.value))}
            >
              <option value="" disabled>
                Select Region
              </option>

              <option value="ALL">All Affected Regions</option>

              {selectedStateRegions.map((region) => {
                return (
                  <React.Fragment key={region.id}>
                    <option value={region.id}>{region.name}</option>
                  </React.Fragment>
                );
              })}
            </select>
          </div>
        )}

        {(selectedAggregation === 'state' ||
          selectedAggregation === 'county') && (
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
        )}

        {selectedAggregation === 'county' && (
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
        )}
      </div>

      <div css={filterGroupStyles}>
        <p css={filterTextStyles}>Select units:</p>

        <label>
          <input
            type="radio"
            name="unit"
            value={'emissions'}
            checked={selectedUnit === 'emissions'}
            onChange={(ev) => {
              const unit = ev.target.value as MonthlyUnit;
              dispatch(selectMonthlyUnit(unit));
            }}
          />
          Emission changes (lbs or tons)
        </label>

        <label>
          <input
            type="radio"
            name="unit"
            value={'percentages'}
            checked={selectedUnit === 'percentages'}
            onChange={(ev) => {
              const unit = ev.target.value as MonthlyUnit;
              dispatch(selectMonthlyUnit(unit));
            }}
          />
          Percent change
        </label>
      </div>

      <div css={emissionsChartsStyles}>
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
    </React.Fragment>
  );
}

export default EmissionsChart;
