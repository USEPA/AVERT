import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

function EEREChartContent() {
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
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
