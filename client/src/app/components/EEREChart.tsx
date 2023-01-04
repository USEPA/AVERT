/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// ---
import { Tooltip } from 'app/components/Tooltip';
import {
  bottomMessageStyles,
  errorMessageStyles,
  warningMessageStyles,
} from 'app/components/Panels';
import { useTypedSelector } from 'app/redux/index';
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

const ValidationMessage = styled('p')<{ type: 'error' | 'warning' }>`
  ${({ type }) => {
    if (type === 'error') {
      return css`
        ${bottomMessageStyles};
        ${errorMessageStyles}
      `;
    }

    if (type === 'warning') {
      return css`
        ${bottomMessageStyles};
        ${warningMessageStyles}
      `;
    }
  }}
`;

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

export function EEREChart() {
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
    const hourlyMs = hour * 60 * 60 * 1000;
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
      tickInterval: 30 * 24 * 3600 * 1000,
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

  // boolean flag to render chart and error/warning when hourlyEere exits
  let readyToRender = hourlyEere?.length > 0;

  let chart = null;
  // conditionally re-define chart when readyToRender (hourlyEere exists)

  if (readyToRender) {
    const totalLoadMwh = hourlyEere.reduce((a, b) => a + b, 0);
    const totalLoadGwh = Math.round(totalLoadMwh / -1000);

    // calculate the total equivalent number of american homes
    // (annual kwh of electricity used by the average american home is 12,146)
    const equivalentHomes = Math.round((totalLoadMwh / 12_146) * -1000);

    chart = (
      <>
        <h3 className="margin-0 font-sans-md line-height-sans-2 text-base-darker text-center">
          EE/RE profile based on values entered:&nbsp;
          <Tooltip id="eere-profile">
            <p className="margin-0 font-sans-sm text-base-darkest text-normal text-left">
              This graph shows the hourly changes in load that will result from
              the inputs entered above. It reflects a combination of all inputs,
              typical capacity factors for wind and solar, and adjustments for
              avoided transmission and distribution line loss, where applicable.
              This hourly EE/RE profile will be used to calculate the avoided
              emissions for this AVERT region.
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

        <p className="margin-top-2 text-base-dark">
          This EE/RE profile will displace{' '}
          <strong>{totalLoadGwh.toLocaleString()} GWh</strong> of regional
          fossil fuel generation over the course of a year. For reference, this
          equals the annual electricity consumed by{' '}
          <strong>{equivalentHomes.toLocaleString()}</strong> average homes in
          the United States.
        </p>
      </>
    );
  }

  function validationMessage(type: 'error' | 'warning') {
    const x = {
      heading: '',
      threshold: '',
      value: 0,
      timestamp: { month: 0, day: 0, hour: 0 },
    };

    if (type === 'error') {
      x.heading = 'ERROR';
      x.threshold = '30';
      x.value = hardTopExceedanceValue;
      x.timestamp = hardTopExceedanceTimestamp;
    }

    if (type === 'warning') {
      x.heading = 'WARNING';
      x.threshold = '15';
      x.value = softTopExceedanceValue;
      x.timestamp = softTopExceedanceTimestamp;
    }

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
    const month = months[x.timestamp.month - 1];
    const day = x.timestamp.day;
    const hour =
      x.timestamp.hour === 0
        ? 12
        : x.timestamp.hour > 12
        ? x.timestamp.hour - 12
        : x.timestamp.hour;
    const ampm = x.timestamp.hour > 12 ? 'PM' : 'AM';

    return (
      <ValidationMessage type={type} className="margin-bottom-0 font-sans-xs">
        <span className="display-block margin-bottom-05 text-bold">
          {x.heading}:
        </span>
        The combined impact of your proposed programs would displace more than{' '}
        <strong>{x.threshold}%</strong> of regional fossil generation in at
        least one hour of the year. (Maximum value:{' '}
        <strong>
          {x.value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </strong>
        % on{' '}
        <strong>
          {month} {day} at {hour}:00 {ampm}
        </strong>
        ). The recommended limit for AVERT is 15%, as AVERT is designed to
        simulate marginal operational changes in load, rather than large-scale
        changes that may change fundamental dynamics. Please reduce one or more
        of your inputs to ensure more reliable results.
      </ValidationMessage>
    );
  }

  // set validationError when readyToRender and hardValid is false
  const validationError =
    readyToRender && !hardValid ? validationMessage('error') : null;

  // set validationWarning when readyToRender, softValid is false, and hardValid is true
  const validationWarning =
    readyToRender && !softValid && hardValid
      ? validationMessage('warning')
      : null;

  return (
    <div data-avert-chart>
      {chart}
      {validationError}
      {validationWarning}
    </div>
  );
}
