import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import type { RegionalLoadData } from 'app/redux/reducers/geography';
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

function EquivalentHomesText(props: { hourlyEere: number[] }) {
  const { hourlyEere } = props;

  const totalLoadMwh = hourlyEere.reduce((a, b) => a + b, 0);
  const totalLoadGwh = Math.round(totalLoadMwh / -1_000);

  /**
   * the annual kwh of electricity used by the average american home is 12,146
   */
  const equivalentHomes = Math.round((totalLoadMwh / 12_146) * -1_000);

  // TODO: determine which message to display for an increased load from EVs
  if (totalLoadGwh < 0) return null;

  return (
    <p className="margin-top-2 text-base-dark">
      This EE/RE profile will displace{' '}
      <strong>{totalLoadGwh.toLocaleString()} GWh</strong> of regional fossil
      fuel generation over the course of a year. For reference, this equals the
      annual electricity consumed by{' '}
      <strong>{equivalentHomes.toLocaleString()}</strong> average homes in the
      United States.
    </p>
  );
}

function ValidationMessage(props: {
  type: 'error' | 'warning';
  value: number;
  timestamp: RegionalLoadData;
}) {
  const { type, value, timestamp } = props;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[timestamp.month - 1];
  const day = timestamp.day;
  const hour =
    timestamp.hour === 0
      ? 12
      : timestamp.hour > 12
      ? timestamp.hour - 12
      : timestamp.hour;
  const ampm = timestamp.hour > 12 ? 'PM' : 'AM';
  const percentage = value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className={`usa-alert usa-alert--${type} margin-bottom-0`}>
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">
          {type === 'error' ? 'ERROR' : 'WARNING'}
        </h4>
        <p>
          The combined impact of your proposed programs would displace more than{' '}
          <strong>{type === 'error' ? '30' : '15'}%</strong> of regional fossil
          generation in at least one hour of the year.&nbsp;&nbsp;
          <em>
            (Maximum value: <strong>{percentage}</strong>% on{' '}
            <strong>
              {month} {day} at {hour}:00 {ampm}
            </strong>
            ).
          </em>
        </p>

        <p className="margin-0">
          The recommended limit for AVERT is 15%, as AVERT is designed to
          simulate marginal operational changes in load, rather than large-scale
          changes that may change fundamental dynamics. Please reduce one or
          more of your inputs to ensure more reliable results.
        </p>
      </div>
    </div>
  );
}

export function EVWarningMessage() {
  const constantMwh = useTypedSelector(({ eere }) => eere.inputs.constantMwh);
  const annualGwh = useTypedSelector(({ eere }) => eere.inputs.annualGwh);
  const broadProgram = useTypedSelector(({ eere }) => eere.inputs.broadProgram);
  const reduction = useTypedSelector(({ eere }) => eere.inputs.reduction);
  const topHours = useTypedSelector(({ eere }) => eere.inputs.topHours);
  const onshoreWind = useTypedSelector(({ eere }) => eere.inputs.onshoreWind);
  const offshoreWind = useTypedSelector(({ eere }) => eere.inputs.offshoreWind);
  const utilitySolar = useTypedSelector(({ eere }) => eere.inputs.utilitySolar);
  const rooftopSolar = useTypedSelector(({ eere }) => eere.inputs.rooftopSolar);
  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);

  const eeInputsEmpty =
    constantMwh === '' &&
    annualGwh === '' &&
    broadProgram === '' &&
    reduction === '' &&
    topHours === '';

  const reInputsEmpty =
    onshoreWind === '' &&
    offshoreWind === '' &&
    utilitySolar === '' &&
    rooftopSolar === '';

  const evInputsEmpty =
    batteryEVs === '' &&
    hybridEVs === '' &&
    transitBuses === '' &&
    schoolBuses === '';

  if (eeInputsEmpty && reInputsEmpty && !evInputsEmpty) {
    return (
      <div className="usa-alert usa-alert--warning">
        <div className="usa-alert__body">
          <h4 className="usa-alert__heading">WARNING</h4>
          <p>
            <strong>
              You have entered a quantity of EVs, but have not entered any
              energy efficiency or renewable energy.
            </strong>
          </p>

          <p>
            Recent trends show significant amounts of energy efficiency and
            renewables coming online. Consider adding these resources alongside
            EVs in order to examine the portfolio effects of adding multiple
            resources at the same time. The “EE/RE and EV Comparison” table
            above summarizes recent historical ERE additions and compares these
            with the EERE required to offset your entered EV demand.
          </p>

          <p>
            For more ideas on how to model EVs in AVERT, see Appendix J in the
            AVERT user manual.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function EEREChartContent() {
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const softValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softValid,
  );
  const softTopExceedanceValue = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softTopExceedanceValue,
  );
  const softTopExceedanceTimestamp = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softTopExceedanceTimestamp,
  );
  const hardValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardValid,
  );
  const hardTopExceedanceValue = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardTopExceedanceValue,
  );
  const hardTopExceedanceTimestamp = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardTopExceedanceTimestamp,
  );
  const hourlyEere = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hourlyEere,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  const rdfYear =
    geographicFocus === 'regions'
      ? selectedRegion?.rdf.run.year
      : selectedStateRegions[0]?.rdf.run.year;

  const year = rdfYear || new Date().getFullYear();

  const hourlyData = hourlyEere.map((eere, hour) => {
    const firstHourOfYear = Date.UTC(year, 0, 1);
    const hourlyMs = hour * 60 * 60 * 1_000;
    return [new Date().setTime(firstHourOfYear + hourlyMs), eere];
  });

  const chartConfig: Highcharts.Options = {
    chart: {
      height: 300,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
    },
    accessibility: {
      description: 'EE/RE profile',
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        const x = Number(this.x);
        const y = Number(this.y);
        return `<span style="font-size: 10px">
          ${Highcharts.dateFormat('%m/%d/%y %l:%M %P', x)}</span><br/>
          <strong>${Math.round(y).toLocaleString()}</strong> MW`;
      },
    },
    lang: {
      contextButtonTitle: 'Export options',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%b',
      },
      tickInterval: 30 * 24 * 3600 * 1_000,
      title: {
        text: undefined,
      },
    },
    yAxis: {
      title: {
        text: 'Change in load (MW)',
      },
      labels: {
        formatter: function () {
          return Math.round(Number(this.value)).toString();
        },
      },
    },
    series: [
      {
        type: 'line',
        name: 'EERE Load Output',
        data: hourlyData,
        color: '#058dc7',
      },
    ],
  };

  return (
    <div data-avert-chart>
      {hourlyEere?.length > 0 && (
        <>
          <h3 className="margin-0 font-sans-md line-height-sans-2 text-base-darker text-center">
            EE/RE profile based on values entered:&nbsp;
            <Tooltip id="eere-profile">
              <p className="margin-0 font-sans-sm text-base-darkest text-normal text-left">
                This graph shows the hourly changes in load that will result
                from the inputs entered above. It reflects a combination of all
                inputs, typical capacity factors for wind and solar, and
                adjustments for avoided transmission and distribution line loss,
                where applicable. This hourly EE/RE profile will be used to
                calculate the avoided emissions for this AVERT region.
              </p>
            </Tooltip>
          </h3>

          <h4 className="margin-top-1 font-sans-2xs text-base-darker text-normal text-center">
            Adjusted for transmission and distribution line loss and wind and
            solar capacity factors, where applicable.
          </h4>

          <HighchartsReact
            highcharts={Highcharts}
            options={chartConfig}
            callback={(_chart: Highcharts.Chart) => {
              // callback for after highcharts chart renders
              // as this entire react app is ultimately served in an iframe on another page,
              // this document has a click handler that sends document's height to other window,
              // which can then set the embedded iframe's height (see public/post-message.js)
              document.querySelector('html')?.click();
            }}
          />

          <EquivalentHomesText hourlyEere={hourlyEere} />

          <EVWarningMessage />

          {!hardValid && (
            <ValidationMessage
              type="error"
              value={hardTopExceedanceValue}
              timestamp={hardTopExceedanceTimestamp}
            />
          )}

          {hardValid && !softValid && (
            <ValidationMessage
              type="warning"
              value={softTopExceedanceValue}
              timestamp={softTopExceedanceTimestamp}
            />
          )}
        </>
      )}
    </div>
  );
}

export function EEREChart() {
  return (
    <ErrorBoundary
      message={
        <>
          EE/RE Impacts chart error. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <EEREChartContent />
    </ErrorBoundary>
  );
}
