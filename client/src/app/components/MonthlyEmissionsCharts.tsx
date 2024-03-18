import { ReactNode } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useAppSelector } from '@/app/redux/index';
import type {
  Aggregation,
  Source,
  Unit,
} from '@/app/redux/reducers/monthlyEmissions';
import {
  setMonthlyEmissionsAggregation,
  setMonthlyEmissionsRegionId,
  setMonthlyEmissionsStateId,
  setMonthlyEmissionsCountyName,
  setMonthlyEmissionsPollutant,
  setMonthlyEmissionsSource,
  setMonthlyEmissionsUnit,
} from '@/app/redux/reducers/monthlyEmissions';
import type {
  EmissionsData,
  CombinedSectorsEmissionsData,
} from '@/app/calculations/emissions';
import { useSelectedRegion, useSelectedStateRegions } from '@/app/hooks';
import type { Pollutant, RegionId, StateId } from '@/app/config';
import { regions, states } from '@/app/config';

HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

type ChartData = {
  name: string;
  data: number[] | null;
  color: string;
  unit: string;
};

/**
 * Creates monthly power sector emissions data for either emissions changes or
 * percentage changes, for display in the monthly charts.
 */
function setMonthlyPowerData(
  data: EmissionsData[keyof EmissionsData],
  unit: Unit,
) {
  const powerData = data.power;
  if (!powerData) return null;

  const monthlyEmissionsChanges: number[] = [];
  const monthlyPercentageChanges: number[] = [];

  for (const key in powerData.monthly) {
    const month = Number(key);
    const { original, postEere } = powerData.monthly[month];

    const emissionsChange = postEere - original;
    const percentChange = (emissionsChange / original) * 100 || 0;

    monthlyEmissionsChanges.push(emissionsChange);
    monthlyPercentageChanges.push(percentChange);
  }

  return unit === 'emissions'
    ? monthlyEmissionsChanges
    : monthlyPercentageChanges;
}

/**
 * Creates monthly transportation sector emissions data for display in the
 * monthly charts.
 */
function setMonthlyVehicleData(
  data: EmissionsData[keyof EmissionsData],
  aggregation: Aggregation,
) {
  const vehicleData = data.vehicle;
  if (!vehicleData || aggregation !== 'region') return null;

  const monthlyEmissionsChanges: number[] = [];

  for (const key in vehicleData.monthly) {
    const month = Number(key);
    const data = vehicleData.monthly[month];
    monthlyEmissionsChanges.push(data);
  }

  return monthlyEmissionsChanges;
}

/**
 * Sets chart series data based on the currently selected source(s) and unit.
 */
function setChartSeriesData(options: {
  seriesData: { power: ChartData; vehicles: ChartData };
  currentSources: Source[];
  currentUnit: Unit;
}) {
  const { seriesData, currentSources, currentUnit } = options;

  const result = Object.entries(seriesData).reduce((array, [key, value]) => {
    const source = key as Source;

    if (currentSources.includes(source) && value.data) {
      /** NOTE: we don't have percent change data for vehicles */
      if (
        currentUnit === 'emissions' ||
        (currentUnit === 'percentages' && source !== 'vehicles')
      ) {
        array.push(value);
      }
    }

    return array;
  }, [] as ChartData[]);

  return result;
}

function Chart(props: { pollutant: Pollutant; data: EmissionsData }) {
  const { pollutant, data } = props;

  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const egusNeedingEmissionsReplacement = useAppSelector(
    ({ results }) => results.egusNeedingEmissionsReplacement,
  );
  const emissionsReplacements = useAppSelector(
    ({ results }) => results.emissionsReplacements,
  );
  const currentAggregation = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.aggregation,
  );
  const currentRegionId = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.regionId,
  );
  const currentStateId = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.stateId,
  );
  const currentCountyName = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.countyName,
  );
  const currentSources = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.sources,
  );
  const currentUnit = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.unit,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  // console.log({ data, vehicleEmissions }); // NOTE: for debugging purposes

  const so2Data = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.so2, currentUnit),
      color: 'rgba(5, 141, 199, 1)',
      unit: 'lb',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.so2, currentAggregation),
      color: 'rgba(5, 141, 199, 0.5)',
      unit: 'lb',
    },
  };

  const noxData = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.nox, currentUnit),
      color: 'rgba(237, 86, 27, 1)',
      unit: 'lb',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.nox, currentAggregation),
      color: 'rgba(237, 86, 27, 0.5)',
      unit: 'lb',
    },
  };

  const co2Data = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.co2, currentUnit),
      color: 'rgba(80, 180, 50, 1)',
      unit: 'tons',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.co2, currentAggregation),
      color: 'rgba(80, 180, 50, 0.5)',
      unit: 'tons',
    },
  };

  const pm25Data = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.pm25, currentUnit),
      color: 'rgba(102, 86, 131, 1)',
      unit: 'lb',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.pm25, currentAggregation),
      color: 'rgba(102, 86, 131, 0.5)',
      unit: 'lb',
    },
  };

  const vocsData = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.vocs, currentUnit),
      color: 'rgba(255, 193, 7, 1)',
      unit: 'lb',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.vocs, currentAggregation),
      color: 'rgba(255, 193, 7, 0.5)',
      unit: 'lb',
    },
  };

  const nh3Data = {
    power: {
      name: 'Power Sector',
      data: setMonthlyPowerData(data.nh3, currentUnit),
      color: 'rgba(0, 150, 136, 1)',
      unit: 'lb',
    },
    vehicles: {
      name: 'Vehicles',
      data: setMonthlyVehicleData(data.nh3, currentAggregation),
      color: 'rgba(0, 150, 136, 0.5)',
      unit: 'lb',
    },
  };

  const flaggedEGUs = Object.keys(emissionsReplacements).includes(pollutant)
    ? Object.values(egusNeedingEmissionsReplacement)
    : [];

  const flaggedRegion =
    currentAggregation === 'region' &&
    (geographicFocus === 'regions'
      ? flaggedEGUs.length > 0
      : (flaggedEGUs.length > 0 && currentRegionId === 'ALL') ||
        flaggedEGUs.filter((egu) => egu.region === currentRegionId).length > 0);

  const flaggedState =
    currentAggregation === 'state' &&
    flaggedEGUs.some((egu) => egu.state === currentStateId);

  const flaggedCounty =
    currentAggregation === 'county' &&
    flaggedEGUs.some((egu) => {
      return egu.state === currentStateId && egu.county === currentCountyName;
    });

  // format 'city' if found in county name
  const countyName = currentCountyName.replace(/city/, '(City)');

  const regionChartTitle =
    geographicFocus === 'regions'
      ? `${selectedRegion?.name} Region`
      : geographicFocus === 'states'
      ? selectedStateRegions.length === 1
        ? `${regions[selectedStateRegions[0].id]?.name} Region`
        : currentRegionId === ''
        ? '' // multiple regions but a region has not yet been selected
        : currentRegionId === 'ALL'
        ? `${selectedStateRegions
            .map((region) => regions[region.id]?.name)
            .join(', ')} Regions`
        : `${regions[currentRegionId as RegionId]?.name} Region`
      : '';

  const stateChartTitle =
    currentStateId === ''
      ? '' // state has not yet been selected
      : `${states[currentStateId as StateId].name}`;

  const countyChartTitle =
    currentCountyName === ''
      ? '' // county has not yet been selected
      : `${countyName}, ${states[currentStateId as StateId].name}`;

  const chartLocationTitle =
    currentAggregation === 'region'
      ? regionChartTitle
      : currentAggregation === 'state'
      ? stateChartTitle
      : currentAggregation === 'county'
      ? countyChartTitle
      : '';

  function formatTitle(pollutant: string) {
    return `<tspan class='font-sans-2xs text-base-darker'>
        <tspan class='font-sans-xs text-bold'>Change in ${pollutant} Emissions:</tspan>
        ${chartLocationTitle}
      </tspan>`;
  }

  function formatYAxis(unit: string) {
    return currentUnit === 'percentages'
      ? 'Percent change'
      : `Emission changes (${unit})`;
  }

  const commonConfig: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 300,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      allowHTML: true,
    },
    lang: {
      contextButtonTitle: 'Export options',
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      series: {
        animation: false,
        events: {
          legendItemClick: function () {
            return false;
          },
        },
        stacking: 'normal',
      },
    },
    tooltip: {
      animation: false,
      pointFormatter: function () {
        const dataPoint = this.y?.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

        const suffix =
          currentUnit === 'emissions'
            ? ` ${(this.series.options as any).unit}`
            : '%';

        return `<strong>${dataPoint}</strong>${suffix}`;
      },
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // prettier-ignore
    },
  };

  const so2Config = {
    ...commonConfig,
    title: { text: formatTitle('SO<sub>2</sub>'), useHTML: true },
    yAxis: { title: { text: formatYAxis('lb') } },
    series: setChartSeriesData({
      seriesData: so2Data,
      currentSources,
      currentUnit,
    }),
  };

  const noxConfig = {
    ...commonConfig,
    title: { text: formatTitle('NO<sub>X</sub>'), useHTML: true },
    yAxis: { title: { text: formatYAxis('lb') } },
    series: setChartSeriesData({
      seriesData: noxData,
      currentSources,
      currentUnit,
    }),
  };

  const co2Config = {
    ...commonConfig,
    title: { text: formatTitle('CO<sub>2</sub>'), useHTML: true },
    yAxis: { title: { text: formatYAxis('tons') } },
    series: setChartSeriesData({
      seriesData: co2Data,
      currentSources,
      currentUnit,
    }),
  };

  const pm25Config = {
    ...commonConfig,
    title: { text: formatTitle('PM<sub>2.5</sub>'), useHTML: true },
    yAxis: { title: { text: formatYAxis('lb') } },
    series: setChartSeriesData({
      seriesData: pm25Data,
      currentSources,
      currentUnit,
    }),
  };

  const vocsConfig = {
    ...commonConfig,
    title: { text: formatTitle('VOC'), useHTML: true },
    yAxis: { title: { text: formatYAxis('lb') } },
    series: setChartSeriesData({
      seriesData: vocsData,
      currentSources,
      currentUnit,
    }),
  };

  const nh3Config = {
    ...commonConfig,
    title: { text: formatTitle('NH<sub>3</sub>'), useHTML: true },
    yAxis: { title: { text: formatYAxis('lb') } },
    series: setChartSeriesData({
      seriesData: nh3Data,
      currentSources,
      currentUnit,
    }),
  };

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

  if (currentUnit === 'percentages') {
    if (flaggedRegion || flaggedState || flaggedCounty) {
      return (
        <div className="avert-box padding-105 height-full">
          <p className="font-sans-2xs line-height-sans-3 text-center text-base-darker">
            <span className="font-sans-xs text-bold">
              Change in {pollutantMarkup.get(pollutant)} Emissions:
            </span>{' '}
            {chartLocationTitle}
          </p>

          <p className="margin-0 font-sans-3xs text-base-dark">
            Percent change statistics are not available for{' '}
            {pollutantMarkup.get(pollutant)} because the geographic area you’ve
            selected features one or more power plants with an infrequent{' '}
            {pollutantMarkup.get(pollutant)} emissions event. See Section 2 of
            the{' '}
            <a
              className="usa-link"
              href="https://www.epa.gov/avert"
              target="_parent"
              rel="noreferrer"
            >
              AVERT User Manual
            </a>{' '}
            for more information.
          </p>
        </div>
      );
    }
  }

  return (
    <div data-avert-chart={pollutant}>
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
    </div>
  );
}

/**
 * Sets emissions data based on the currently selected filters.
 */
function setFilteredData(options: {
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData;
  aggregation: Aggregation;
  regionId: RegionId | 'ALL';
  stateId: StateId;
  county: string;
}) {
  const {
    combinedSectorsEmissionsData,
    aggregation,
    regionId,
    stateId,
    county,
  } = options;

  const emptyResult = {} as EmissionsData;

  if (!combinedSectorsEmissionsData) return emptyResult;

  const { total, regions, states, counties } = combinedSectorsEmissionsData;

  const regionResult =
    regionId === 'ALL'
      ? total
      : Boolean(regions?.[regionId])
      ? regions[regionId]
      : emptyResult;

  const stateResult = Boolean(states?.[stateId])
    ? states[stateId]
    : emptyResult;

  const countyResult = Boolean(counties?.[stateId]?.[county])
    ? counties[stateId][county]
    : emptyResult;

  const result =
    aggregation === 'region'
      ? regionResult
      : aggregation === 'state'
      ? stateResult
      : aggregation === 'county'
      ? countyResult
      : emptyResult;

  return result;
}

function MonthlyEmissionsChartsContent() {
  const dispatch = useDispatch();
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const combinedSectorsEmissionsData = useAppSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );
  const currentAggregation = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.aggregation,
  );
  const currentRegionId = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.regionId,
  );
  const currentStateId = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.stateId,
  );
  const currentCountyName = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.countyName,
  );
  const currentPollutants = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.pollutants,
  );
  const currentSources = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.sources,
  );
  const currentUnit = useAppSelector(
    ({ monthlyEmissions }) => monthlyEmissions.unit,
  );
  const availableStates = useAppSelector(({ monthlyEmissions }) => {
    return Object.keys(monthlyEmissions.statesAndCounties).sort();
  });
  const availableCounties = useAppSelector(({ monthlyEmissions }) => {
    return monthlyEmissions.statesAndCounties[currentStateId as StateId]?.sort(); // prettier-ignore
  });

  const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = inputs;

  const evInputsEmpty =
    (batteryEVs === '' || batteryEVs === '0') &&
    (hybridEVs === '' || hybridEVs === '0') &&
    (transitBuses === '' || transitBuses === '0') &&
    (schoolBuses === '' || schoolBuses === '0');

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  const regionId =
    geographicFocus === 'regions' && selectedRegion
      ? selectedRegion.id
      : geographicFocus === 'states' && selectedStateRegions.length === 1
      ? selectedStateRegions[0].id
      : (currentRegionId as RegionId);

  const data = setFilteredData({
    combinedSectorsEmissionsData,
    aggregation: currentAggregation,
    regionId,
    stateId: currentStateId as StateId,
    county: currentCountyName,
  });

  return (
    <>
      <div className="grid-container padding-0 maxw-full">
        <div className="grid-row" style={{ margin: '0 -0.5rem' }}>
          <div className="padding-1 tablet:grid-col-6 desktop:grid-col-3">
            <div className="avert-box padding-105 height-full">
              <p className="avert-box-heading font-serif-2xs line-height-serif-2 text-bold">
                Select level of aggregation:
              </p>

              <div
                className="mobile-lg:display-flex flex-wrap"
                style={{ margin: '0 -0.5rem' }}
              >
                <div className="flex-1">
                  <div className="usa-radio padding-x-1">
                    <input
                      id="aggregation-region"
                      className="usa-radio__input"
                      type="radio"
                      name="aggregation"
                      value="region"
                      checked={currentAggregation === 'region'}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsAggregation('region'));
                      }}
                      data-avert-monthly-aggregation="region"
                    />

                    <label
                      className="usa-radio__label"
                      htmlFor="aggregation-region"
                    >
                      Region
                    </label>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="usa-radio padding-x-1">
                    <input
                      id="aggregation-state"
                      className="usa-radio__input"
                      type="radio"
                      name="aggregation"
                      value="state"
                      checked={currentAggregation === 'state'}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsAggregation('state'));

                        /**
                         * conditionally uncheck vehicles, as there's no monthly
                         * transportation level data at the state level
                         */
                        if (currentSources.includes('vehicles')) {
                          dispatch(setMonthlyEmissionsSource('vehicles'));
                        }

                        if (currentStateId) {
                          dispatch(setMonthlyEmissionsStateId(currentStateId));
                        }
                      }}
                      data-avert-monthly-aggregation="state"
                    />

                    <label
                      className="usa-radio__label"
                      htmlFor="aggregation-state"
                    >
                      State
                    </label>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="usa-radio padding-x-1">
                    <input
                      id="aggregation-county"
                      className="usa-radio__input"
                      type="radio"
                      name="aggregation"
                      value="county"
                      checked={currentAggregation === 'county'}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsAggregation('county'));

                        /**
                         * conditionally uncheck vehicles, as there's no monthly
                         * transportation level data at the county level
                         */
                        if (currentSources.includes('vehicles')) {
                          dispatch(setMonthlyEmissionsSource('vehicles'));
                        }

                        if (currentCountyName) {
                          dispatch(
                            setMonthlyEmissionsCountyName(currentCountyName),
                          );
                        }
                      }}
                      data-avert-monthly-aggregation="county"
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

              <div data-avert-monthly-geography-selects>
                {geographicFocus === 'states' &&
                  currentAggregation === 'region' &&
                  selectedStateRegions.length > 1 && (
                    <select
                      className={
                        `usa-select ` +
                        `display-inline-block height-auto maxw-full ` +
                        `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                        `border-width-1px border-solid border-base-light font-sans-xs`
                      }
                      value={currentRegionId}
                      onChange={(ev) => {
                        dispatch(setMonthlyEmissionsRegionId(ev.target.value));
                      }}
                      data-avert-monthly-geography="region"
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

                {(currentAggregation === 'state' ||
                  currentAggregation === 'county') && (
                  <>
                    <select
                      className={
                        `usa-select ` +
                        `display-inline-block height-auto maxw-full ` +
                        `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                        `border-width-1px border-solid border-base-light font-sans-xs`
                      }
                      value={currentStateId}
                      onChange={(ev) =>
                        dispatch(setMonthlyEmissionsStateId(ev.target.value))
                      }
                      data-avert-monthly-geography="state"
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

                    {currentAggregation === 'county' && (
                      <select
                        className={
                          `usa-select ` +
                          `display-inline-block height-auto maxw-full ` +
                          `margin-top-105 padding-left-1 padding-y-05 padding-right-4 ` +
                          `border-width-1px border-solid border-base-light font-sans-xs`
                        }
                        value={currentCountyName}
                        onChange={(ev) => {
                          dispatch(setMonthlyEmissionsCountyName(ev.target.value)); // prettier-ignore
                        }}
                        data-avert-monthly-geography="county"
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

          <div className="padding-1 tablet:grid-col-6 desktop:grid-col-3">
            <div className="avert-box padding-105 height-full">
              <p className="avert-box-heading font-serif-2xs line-height-serif-2 text-bold">
                Select pollutants:
              </p>

              <div
                className="display-flex mobile-lg:display-block"
                data-avert-monthly-pollutants
              >
                <div className="flex-1 mobile-lg:display-flex">
                  <div className="flex-1 mobile-lg:margin-right-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-so2"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="so2"
                        checked={currentPollutants.includes('so2')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('so2'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-so2"
                      >
                        SO<sub>2</sub>
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 mobile-lg:margin-x-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-nox"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="nox"
                        checked={currentPollutants.includes('nox')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('nox'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-nox"
                      >
                        NO<sub>X</sub>
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 tablet:margin-left-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-co2"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="co2"
                        checked={currentPollutants.includes('co2')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('co2'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-co2"
                      >
                        CO<sub>2</sub>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex-1 mobile-lg:display-flex">
                  <div className="flex-1 mobile-lg:margin-right-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-pm25"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="pm25"
                        checked={currentPollutants.includes('pm25')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('pm25'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-pm25"
                      >
                        PM<sub>2.5</sub>
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 mobile-lg:margin-x-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-vocs"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="vocs"
                        checked={currentPollutants.includes('vocs')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('vocs'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-vocs"
                      >
                        VOCs
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 tablet:margin-left-1">
                    <div className="usa-checkbox">
                      <input
                        id="pollutants-nh3"
                        className="usa-checkbox__input"
                        type="checkbox"
                        name="pollutants"
                        value="nh3"
                        checked={currentPollutants.includes('nh3')}
                        onChange={(_ev) => {
                          dispatch(setMonthlyEmissionsPollutant('nh3'));
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="pollutants-nh3"
                      >
                        NH<sub>3</sub>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="padding-1 tablet:grid-col-6 desktop:grid-col-3">
            <div className="avert-box padding-105 height-full">
              <p className="avert-box-heading font-serif-2xs line-height-serif-2 text-bold">
                Select emissions sources:
              </p>

              <div
                className="mobile-lg:display-flex"
                data-avert-monthly-sources
              >
                <div className="flex-1 mobile-lg:margin-right-1">
                  <div className="usa-checkbox">
                    <input
                      id="source-power"
                      className="usa-checkbox__input"
                      type="checkbox"
                      name="source"
                      value="power"
                      checked={currentSources.includes('power')}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsSource('power'));
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor="source-power"
                    >
                      Power sector
                    </label>
                  </div>
                </div>

                <div className="flex-1 mobile-lg:margin-left-1">
                  <div className="usa-checkbox">
                    <input
                      id="source-vehicles"
                      className="usa-checkbox__input"
                      type="checkbox"
                      name="source"
                      value="vehicles"
                      checked={currentSources.includes('vehicles')}
                      disabled={
                        evInputsEmpty || currentAggregation !== 'region'
                      }
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsSource('vehicles'));
                      }}
                    />

                    <label
                      className="usa-checkbox__label"
                      htmlFor="source-vehicles"
                    >
                      Vehicles
                    </label>
                  </div>
                </div>
              </div>

              {evInputsEmpty ? (
                <p className="margin-top-105 margin-bottom-0 font-sans-3xs line-height-sans-3">
                  <strong>NOTE:</strong> No electric vehicles inputs entered.
                </p>
              ) : currentAggregation !== 'region' ? (
                <p className="margin-top-105 margin-bottom-0 font-sans-3xs line-height-sans-3">
                  <strong>NOTE:</strong> Monthly emissions data for vehicles are
                  only available at the regional level.
                </p>
              ) : null}
            </div>
          </div>

          <div className="padding-1 tablet:grid-col-6 desktop:grid-col-3">
            <div className="avert-box padding-105 height-full">
              <p className="avert-box-heading font-serif-2xs line-height-serif-2 text-bold">
                Select units:
              </p>

              <div className="mobile-lg:display-flex">
                <div className="flex-1 mobile-lg:margin-right-1">
                  <div className="usa-radio">
                    <input
                      id="units-emissions"
                      className="usa-radio__input"
                      type="radio"
                      name="units"
                      value="emissions"
                      checked={currentUnit === 'emissions'}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsUnit('emissions'));
                      }}
                      data-avert-monthly-unit="emissions"
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

                <div className="flex-1 mobile-lg:margin-left-1">
                  <div className="usa-radio">
                    <input
                      id="units-percentages"
                      className="usa-radio__input"
                      type="radio"
                      name="units"
                      value="percentages"
                      checked={currentUnit === 'percentages'}
                      onChange={(_ev) => {
                        dispatch(setMonthlyEmissionsUnit('percentages'));
                      }}
                      data-avert-monthly-unit="percentages"
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

              {currentUnit === 'percentages' && (
                <p className="margin-top-105 margin-bottom-0 font-sans-3xs line-height-sans-3">
                  <strong>NOTE:</strong> Percent change data only exists for the
                  power sector.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div data-avert-charts>
        {combinedSectorsEmissionsData && (
          <div className="grid-container padding-0 maxw-full">
            <div className="grid-row" style={{ margin: '0 -0.5rem' }}>
              {geographicFocus === 'states' &&
              currentAggregation === 'region' &&
              selectedStateRegions.length > 1 &&
              !currentRegionId ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>No region selected.</strong>
                      <br />
                      Please select a region.
                    </p>
                  </div>
                </div>
              ) : currentAggregation === 'state' && !currentStateId ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>No state selected.</strong>
                      <br />
                      Please select a state.
                    </p>
                  </div>
                </div>
              ) : currentAggregation === 'county' && !currentCountyName ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>No county selected.</strong>
                      <br />
                      Please select a county.
                    </p>
                  </div>
                </div>
              ) : currentPollutants.length === 0 ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>No pollutants selected.</strong>
                      <br />
                      Please select at least one pollutant to see monthly
                      emissions data charted.
                    </p>
                  </div>
                </div>
              ) : currentSources.length === 0 ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>No emissions sources selected.</strong>
                      <br />
                      Please select at least one emissions source to see monthly
                      emissions data charted.
                    </p>
                  </div>
                </div>
              ) : currentSources.length === 1 &&
                currentSources.includes('vehicles') &&
                currentUnit === 'percentages' ? (
                <div className="padding-1 grid-col-12">
                  <div className="avert-box padding-3">
                    <p className="margin-0 font-sans-xs text-center">
                      <strong>
                        No percent change data exists for vehicles.
                      </strong>
                      <br />
                      Please also select “Power sector” as an emissions source
                      or change the selected units to “Emission changes” to see
                      monthly emissions data charted.
                    </p>
                  </div>
                </div>
              ) : (
                currentPollutants.map((pollutant) => {
                  const className =
                    currentPollutants.length === 1
                      ? 'padding-1 grid-col-12'
                      : currentPollutants.length === 2 ||
                        currentPollutants.length === 4
                      ? 'padding-1 tablet:grid-col-6'
                      : 'padding-1 tablet:grid-col-6 desktop:grid-col-4';

                  /**
                   * NOTE: The HighchartsReact (inside the Chart component)
                   * component's width is set whenever it initially renders. If
                   * the number of selected pollutants changes, the parent div's
                   * width can change (see `className` above), so we need to
                   * force the Chart component to re-render whenever the number
                   * of selected pollutants changes – we do that by passing in
                   * the number of selected pollutants as the `key` prop to the
                   * Chart component
                   */
                  const key = currentPollutants.length;

                  return (
                    <div key={pollutant} className={className}>
                      <Chart key={key} pollutant={pollutant} data={data} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function MonthlyEmissionsCharts() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading monthly emissions changes charts. Please contact AVERT
          support at{' '}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <MonthlyEmissionsChartsContent />
    </ErrorBoundary>
  );
}
