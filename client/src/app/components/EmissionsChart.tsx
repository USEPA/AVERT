/** @jsxImportSource @emotion/react */

import { ReactNode, Fragment } from 'react';
import { css } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import {
  ReplacementPollutant,
  MonthlyDisplacement,
  calculateMonthlyData,
} from 'app/redux/reducers/displacement';
import {
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
import { Pollutant, RegionId, StateId, regions, states } from 'app/config';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

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

const noChartStyles = css`
  margin-bottom: 1rem;
  padding: 0 1rem 1rem;
  border: 1px solid #ddd;
  background-color: whitesmoke;
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
  const egusNeedingReplacement = useTypedSelector(
    ({ displacement }) => displacement.egusNeedingReplacement,
  );
  const monthlyEmissionChanges = useTypedSelector(
    ({ displacement }) => displacement.monthlyEmissionChanges,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  // set monthlyData for each pollutant, based on selected aggregation
  const initialMonthlyData = {
    month1: { original: 0, postEere: 0 },
    month2: { original: 0, postEere: 0 },
    month3: { original: 0, postEere: 0 },
    month4: { original: 0, postEere: 0 },
    month5: { original: 0, postEere: 0 },
    month6: { original: 0, postEere: 0 },
    month7: { original: 0, postEere: 0 },
    month8: { original: 0, postEere: 0 },
    month9: { original: 0, postEere: 0 },
    month10: { original: 0, postEere: 0 },
    month11: { original: 0, postEere: 0 },
    month12: { original: 0, postEere: 0 },
  };

  const monthlyData: { [key in Pollutant]: MonthlyDisplacement } = {
    so2: { ...initialMonthlyData },
    nox: { ...initialMonthlyData },
    co2: { ...initialMonthlyData },
    pm25: { ...initialMonthlyData },
    vocs: { ...initialMonthlyData },
    nh3: { ...initialMonthlyData },
  };

  for (const item of ['so2', 'nox', 'co2', 'pm25', 'vocs', 'nh3']) {
    const pollutant = item as Pollutant;

    const regionId =
      selectedStateRegions.length === 1
        ? selectedStateRegions[0].id
        : (selectedRegionId as RegionId);

    const stateId = selectedStateId as StateId;

    if (selectedAggregation === 'region') {
      const displacement =
        geographicFocus === 'regions' && selectedRegion
          ? monthlyEmissionChanges.regions[pollutant][selectedRegion.id]
          : monthlyEmissionChanges.regions[pollutant][regionId];
      monthlyData[pollutant] = displacement || initialMonthlyData;
    }

    if (selectedAggregation === 'state') {
      const displacement = monthlyEmissionChanges.states[pollutant][stateId];
      monthlyData[pollutant] = displacement || initialMonthlyData;
    }

    if (selectedAggregation === 'county') {
      /* prettier-ignore */
      const displacement = monthlyEmissionChanges.counties[pollutant][stateId]?.[selectedCountyName];
      monthlyData[pollutant] = displacement || initialMonthlyData;
    }
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

  const regionChartTitle =
    geographicFocus === 'regions'
      ? `${selectedRegion?.name} Region`
      : geographicFocus === 'states'
      ? selectedStateRegions.length === 1
        ? `${regions[selectedStateRegions[0].id]?.name} Region`
        : selectedRegionId === ''
        ? '' // multiple regions but a region has not yet been selected
        : selectedRegionId === 'ALL'
        ? `${selectedStateRegions
            .map((region) => regions[region.id]?.name)
            .join(', ')} Regions`
        : `${regions[selectedRegionId as RegionId]?.name} Region`
      : '';

  const stateChartTitle =
    selectedStateId === ''
      ? '' // state has not yet been selected
      : `${states[selectedStateId as StateId].name}`;

  const countyChartTitle =
    selectedCountyName === ''
      ? '' // county has not yet been selected
      : `${countyName}, ${states[selectedStateId as StateId].name}`;

  const chartLocationTitle =
    selectedAggregation === 'region'
      ? regionChartTitle
      : selectedAggregation === 'state'
      ? stateChartTitle
      : selectedAggregation === 'county'
      ? countyChartTitle
      : '';

  function formatTitle(pollutant: string) {
    return `<tspan class='avert-chart-title'>Change in ${pollutant} Emissions: ${chartLocationTitle}</tspan>`;
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
        data: calculateMonthlyData(monthlyData.so2, selectedUnit),
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
        data: calculateMonthlyData(monthlyData.nox, selectedUnit),
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
        data: calculateMonthlyData(monthlyData.co2, selectedUnit),
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
        data: calculateMonthlyData(monthlyData.pm25, selectedUnit),
        color: '#665683',
        emissionsUnit: 'lbs',
      },
    ],
  };

  const vocsConfig = {
    ...commonConfig,
    title: {
      text: formatTitle('VOCs'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lbs'),
      },
    },
    series: [
      {
        name: 'VOCs',
        data: calculateMonthlyData(monthlyData.vocs, selectedUnit),
        color: '#665683', // TODO
        emissionsUnit: 'lbs',
      },
    ],
  };

  const nh3Config = {
    ...commonConfig,
    title: {
      text: formatTitle('NH<sub>3</sub>'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lbs'),
      },
    },
    series: [
      {
        name: 'NH₃',
        data: calculateMonthlyData(monthlyData.nh3, selectedUnit),
        color: '#665683', // TODO
        emissionsUnit: 'lbs',
      },
    ],
  };

  function renderChart(pollutant: Pollutant) {
    const replacementPotentiallyNeeded = ['generation', 'so2', 'nox', 'co2'];

    const flaggedEGUs = replacementPotentiallyNeeded.includes(pollutant)
      ? egusNeedingReplacement[pollutant as ReplacementPollutant]
      : [];

    const flaggedRegion =
      selectedAggregation === 'region' &&
      (geographicFocus === 'regions'
        ? flaggedEGUs.length > 0
        : (flaggedEGUs.length > 0 && selectedRegionId === 'ALL') ||
          flaggedEGUs.filter((egu) => egu.regionId === selectedRegionId)
            .length > 0);

    const flaggedState =
      selectedAggregation === 'state' &&
      flaggedEGUs.some((egu) => egu.state === selectedStateId);

    const flaggedCounty =
      selectedAggregation === 'county' &&
      flaggedEGUs.some(
        (egu) =>
          egu.state === selectedStateId && egu.county === selectedCountyName,
      );

    // prettier-ignore
    const pollutantMarkup = new Map<Pollutant, ReactNode>()
      .set('so2', <Fragment>SO<sub>2</sub></Fragment>)
      .set('nox', <Fragment>NO<sub>X</sub></Fragment>)
      .set('co2', <Fragment>CO<sub>2</sub></Fragment>)
      .set('pm25', <Fragment>PM<sub>2.5</sub></Fragment>)
      .set('vocs', <Fragment>VOCs</Fragment>)
      .set('nh3', <Fragment>NH<sub>2</sub></Fragment>);

    const chartConfig = new Map<Pollutant, Object>()
      .set('so2', so2Config)
      .set('nox', noxConfig)
      .set('co2', co2Config)
      .set('pm25', pm25Config)
      .set('vocs', vocsConfig)
      .set('nh3', nh3Config);

    if (selectedUnit === 'percentages') {
      if (flaggedRegion || flaggedState || flaggedCounty) {
        return (
          <div css={noChartStyles}>
            <p className="avert-chart-title">
              Change in {pollutantMarkup.get(pollutant)} Emissions:{' '}
              {chartLocationTitle}
            </p>
            <p className="avert-small-text">
              Percent change statistics are not available for{' '}
              {pollutantMarkup.get(pollutant)} because the geographic area
              you’ve selected features one or more power plants with an
              infrequent {pollutantMarkup.get(pollutant)} emissions event. See
              Section 2 of the{' '}
              <a href="https://www.epa.gov/avert">AVERT User Manual</a> for more
              information.
            </p>
          </div>
        );
      }
    }

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={chartConfig.get(pollutant)}
        callback={(_chart: any) => {
          // as this entire react app is ultimately served in an iframe
          // on another page, this document has a click handler that sends
          // the document's height to other window, which can then set the
          // embedded iframe's height (see public/post-message.js)
          document.querySelector('html')?.click();
        }}
      />
    );
  }

  return (
    <Fragment>
      <div css={filterGroupStyles}>
        <p css={filterTextStyles}>Select level of aggregation:</p>

        <label>
          <input
            type="radio"
            name="aggregation"
            value="region"
            checked={selectedAggregation === 'region'}
            onChange={(ev) => {
              dispatch(selectMonthlyAggregation('region'));
            }}
            data-avert-aggregation-toggle="region"
          />
          Region
        </label>

        <label>
          <input
            type="radio"
            name="aggregation"
            value="state"
            checked={selectedAggregation === 'state'}
            onChange={(ev) => {
              dispatch(selectMonthlyAggregation('state'));
              if (selectedStateId) {
                dispatch(selectMonthlyState(selectedStateId));
              }
            }}
            data-avert-aggregation-toggle="state"
          />
          State
        </label>

        <label>
          <input
            type="radio"
            name="aggregation"
            value="county"
            checked={selectedAggregation === 'county'}
            onChange={(ev) => {
              dispatch(selectMonthlyAggregation('county'));
              if (selectedCountyName) {
                dispatch(selectMonthlyCounty(selectedCountyName));
              }
            }}
            data-avert-aggregation-toggle="county"
          />
          County
        </label>
      </div>

      <div css={geographyFilterStyles} data-avert-geography-selects>
        {geographicFocus === 'states' &&
          selectedAggregation === 'region' &&
          selectedStateRegions.length > 1 && (
            <div css={selectGroupStyles}>
              <select
                value={selectedRegionId}
                onChange={(ev) =>
                  dispatch(selectMonthlyRegion(ev.target.value))
                }
                data-avert-geography-select="region"
              >
                <option value="" disabled>
                  Select Region(s)
                </option>

                <option value="ALL">All Affected Regions</option>

                {selectedStateRegions.map((region) => {
                  return (
                    <Fragment key={region.id}>
                      <option value={region.id}>{region.name}</option>
                    </Fragment>
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
              data-avert-geography-select="state"
            >
              <option value="" disabled>
                Select State
              </option>

              {availableStates.map((stateId) => {
                return (
                  <Fragment key={stateId}>
                    <option value={stateId}>
                      {states[stateId as StateId].name}
                    </option>
                  </Fragment>
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
              data-avert-geography-select="county"
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
            value="emissions"
            checked={selectedUnit === 'emissions'}
            onChange={(ev) => {
              const unit = ev.target.value as MonthlyUnit;
              dispatch(selectMonthlyUnit(unit));
            }}
            data-avert-unit-toggle="emissions"
          />
          Emission changes (lbs or tons)
        </label>

        <label>
          <input
            type="radio"
            name="unit"
            value="percentages"
            checked={selectedUnit === 'percentages'}
            onChange={(ev) => {
              const unit = ev.target.value as MonthlyUnit;
              dispatch(selectMonthlyUnit(unit));
            }}
            data-avert-unit-toggle="percentages"
          />
          Percent change
        </label>
      </div>

      <div css={emissionsChartsStyles}>
        <div data-avert-chart>
          {status === 'complete' && renderChart('so2')}
        </div>
        <div data-avert-chart>
          {status === 'complete' && renderChart('nox')}
        </div>
        <div data-avert-chart>
          {status === 'complete' && renderChart('co2')}
        </div>
        <div data-avert-chart>
          {status === 'complete' && renderChart('pm25')}
        </div>
        <div data-avert-chart>
          {status === 'complete' && renderChart('vocs')}
        </div>
        <div data-avert-chart>
          {status === 'complete' && renderChart('nh3')}
        </div>
      </div>
    </Fragment>
  );
}

export default EmissionsChart;
