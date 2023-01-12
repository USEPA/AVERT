import { ReactNode } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// ---
import { useTypedSelector } from 'app/redux/index';
import {
  ReplacementPollutantName,
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
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';
import { Pollutant, RegionId, StateId, regions, states } from 'app/config';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

export function MonthlyEmissionsCharts() {
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
    return `<tspan class='font-sans-md line-height-sans-2 text-base-darker text-center'>
      Change in ${pollutant} Emissions: ${chartLocationTitle}
    </tspan>`;
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
        text: formatYAxis('lb'),
      },
    },
    series: [
      {
        name: 'SO₂',
        data: calculateMonthlyData(monthlyData.so2, selectedUnit),
        color: '#058dc7',
        emissionsUnit: 'lb',
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
        text: formatYAxis('lb'),
      },
    },
    series: [
      {
        name: 'NOₓ',
        data: calculateMonthlyData(monthlyData.nox, selectedUnit),
        color: '#ed561b',
        emissionsUnit: 'lb',
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
        text: formatYAxis('lb'),
      },
    },
    series: [
      {
        name: 'PM₂₅',
        data: calculateMonthlyData(monthlyData.pm25, selectedUnit),
        color: '#665683',
        emissionsUnit: 'lb',
      },
    ],
  };

  const vocsConfig = {
    ...commonConfig,
    title: {
      text: formatTitle('VOC'),
      useHTML: true,
    },
    yAxis: {
      title: {
        text: formatYAxis('lb'),
      },
    },
    series: [
      {
        name: 'VOC',
        data: calculateMonthlyData(monthlyData.vocs, selectedUnit),
        color: '#ffc107',
        emissionsUnit: 'lb',
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
        text: formatYAxis('lb'),
      },
    },
    series: [
      {
        name: 'NH₃',
        data: calculateMonthlyData(monthlyData.nh3, selectedUnit),
        color: '#009688',
        emissionsUnit: 'lb',
      },
    ],
  };

  function renderChart(pollutant: Pollutant) {
    const replacementPotentiallyNeeded = ['generation', 'so2', 'nox', 'co2'];

    const flaggedEGUs = replacementPotentiallyNeeded.includes(pollutant)
      ? egusNeedingReplacement[pollutant as ReplacementPollutantName]
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
      .set('so2', <>SO<sub>2</sub></>)
      .set('nox', <>NO<sub>X</sub></>)
      .set('co2', <>CO<sub>2</sub></>)
      .set('pm25', <>PM<sub>2.5</sub></>)
      .set('vocs', <>VOC</>)
      .set('nh3', <>NH<sub>2</sub></>);

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
          <div
            className={
              `margin-bottom-2 padding-2 bg-base-lightest ` +
              `border-width-1px border-solid border-base-light`
            }
          >
            <p className="font-sans-md line-height-sans-2 text-base-darker text-center">
              Change in {pollutantMarkup.get(pollutant)} Emissions:{' '}
              {chartLocationTitle}
            </p>

            <p className="margin-0 font-sans-xs text-base-dark">
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
    <>
      <div className="margin-top-2 desktop:display-flex">
        <div className="flex-1 tablet:display-flex desktop:margin-right-1">
          <div className="flex-1 margin-bottom-2 tablet:margin-right-1">
            <div className="avert-box padding-105">
              <p className="margin-0 font-sans-2xs line-height-sans-2 text-italic">
                Select level of aggregation:
              </p>

              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-1">
                  <div className="usa-radio">
                    <input
                      id="aggregation-region"
                      className="usa-radio__input"
                      type="radio"
                      name="aggregation"
                      value="region"
                      checked={selectedAggregation === 'region'}
                      onChange={(ev) => {
                        dispatch(selectMonthlyAggregation('region'));
                      }}
                      data-avert-aggregation-toggle="region"
                    />

                    <label
                      className="usa-radio__label"
                      htmlFor="aggregation-region"
                    >
                      Region
                    </label>
                  </div>
                </div>

                <div className="flex-1 tablet:margin-x-1">
                  <div className="usa-radio">
                    <input
                      id="aggregation-state"
                      className="usa-radio__input"
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

                    <label
                      className="usa-radio__label"
                      htmlFor="aggregation-state"
                    >
                      State
                    </label>
                  </div>
                </div>

                <div className="flex-1 tablet:margin-left-1">
                  <div className="usa-radio">
                    <input
                      id="aggregation-county"
                      className="usa-radio__input"
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

                    <label
                      className="usa-radio__label"
                      htmlFor="aggregation-county"
                    >
                      County
                    </label>
                  </div>
                </div>
              </div>

              <div data-avert-geography-selects>
                {geographicFocus === 'states' &&
                  selectedAggregation === 'region' &&
                  selectedStateRegions.length > 1 && (
                    <select
                      className={
                        `usa-select ` +
                        `display-inline-block height-auto maxw-full ` +
                        `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                        `border-width-1px border-solid border-base-light font-sans-xs`
                      }
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

                      {selectedStateRegions.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  )}

                {(selectedAggregation === 'state' ||
                  selectedAggregation === 'county') && (
                  <>
                    <select
                      className={
                        `usa-select ` +
                        `display-inline-block height-auto maxw-full ` +
                        `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                        `border-width-1px border-solid border-base-light font-sans-xs`
                      }
                      value={selectedStateId}
                      onChange={(ev) =>
                        dispatch(selectMonthlyState(ev.target.value))
                      }
                      data-avert-geography-select="state"
                    >
                      <option value="" disabled>
                        Select State
                      </option>

                      {availableStates.map((id) => (
                        <option key={id} value={id}>
                          {states[id as StateId].name}
                        </option>
                      ))}
                    </select>

                    {selectedAggregation === 'county' && (
                      <select
                        className={
                          `usa-select ` +
                          `display-inline-block height-auto maxw-full ` +
                          `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                          `border-width-1px border-solid border-base-light font-sans-xs`
                        }
                        value={selectedCountyName}
                        onChange={(ev) =>
                          dispatch(selectMonthlyCounty(ev.target.value))
                        }
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
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 margin-bottom-2 tablet:margin-left-1">
            <div className="avert-box padding-105">
              <p className="margin-0 font-sans-2xs line-height-sans-2 text-italic">
                Select pollutants:
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 tablet:display-flex desktop:margin-left-1">
          <div className="flex-1 margin-bottom-2 tablet:margin-right-1">
            <div className="avert-box padding-105">
              <p className="margin-0 font-sans-2xs line-height-sans-2 text-italic">
                Select emissions source:
              </p>
            </div>
          </div>

          <div className="flex-1 margin-bottom-2 tablet:margin-left-1">
            <div className="avert-box padding-105">
              <p className="margin-0 font-sans-2xs line-height-sans-2 text-italic">
                Select units:
              </p>

              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-1">
                  <div className="usa-radio">
                    <input
                      id="units-emissions"
                      className="usa-radio__input"
                      type="radio"
                      value="emissions"
                      checked={selectedUnit === 'emissions'}
                      onChange={(ev) => {
                        const unit = ev.target.value as MonthlyUnit;
                        dispatch(selectMonthlyUnit(unit));
                      }}
                      data-avert-unit-toggle="emissions"
                    />

                    <label
                      className="usa-radio__label"
                      htmlFor="units-emissions"
                    >
                      Emission changes{' '}
                      <span className="text-italic">(lb or tons)</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1 tablet:margin-left-1">
                  <div className="usa-radio">
                    <input
                      id="units-percentages"
                      className="usa-radio__input"
                      type="radio"
                      value="percentages"
                      checked={selectedUnit === 'percentages'}
                      onChange={(ev) => {
                        const unit = ev.target.value as MonthlyUnit;
                        dispatch(selectMonthlyUnit(unit));
                      }}
                      data-avert-unit-toggle="percentages"
                    />

                    <label
                      className="usa-radio__label"
                      htmlFor="units-percentages"
                    >
                      Percent change
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          `margin-top-2 padding-2 ` +
          `border-width-1px border-solid border-base-light`
        }
      >
        <div data-avert-chart>
          {status === 'complete' && renderChart('so2')}
        </div>

        <div className="margin-top-2" data-avert-chart>
          {status === 'complete' && renderChart('nox')}
        </div>

        <div className="margin-top-2" data-avert-chart>
          {status === 'complete' && renderChart('co2')}
        </div>

        <div className="margin-top-2" data-avert-chart>
          {status === 'complete' && renderChart('pm25')}
        </div>

        <div className="margin-top-2" data-avert-chart>
          {status === 'complete' && renderChart('vocs')}
        </div>

        <div className="margin-top-2" data-avert-chart>
          {status === 'complete' && renderChart('nh3')}
        </div>
      </div>
    </>
  );
}
