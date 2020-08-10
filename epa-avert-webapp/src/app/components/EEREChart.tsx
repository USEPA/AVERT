/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// components
import Tooltip from 'app/components/Tooltip';
import {
  bottomMessageStyles,
  messageHeadingStyles,
  vadidationErrorStyles,
  vadidationWarningStyles,
} from 'app/components/Panels';
// reducers
import { useTypedSelector } from 'app/redux/index';

const chartSubtitleStyles = css`
  margin-top: 0.5rem;
  font-size: 0.625rem;
  line-height: 1.125;
  text-align: center;
  color: #444;

  @media (min-width: 30em) {
    font-size: 0.6875rem;
  }

  @media (min-width: 40em) {
    font-size: 0.75rem;
  }
`;

const ValidationMessage = styled('p')<{ type: 'error' | 'warning' }>`
  ${({ type }) => {
    if (type === 'error') {
      return css`
        ${bottomMessageStyles};
        ${vadidationErrorStyles}
      `;
    }

    if (type === 'warning') {
      return css`
        ${bottomMessageStyles};
        ${vadidationWarningStyles}
      `;
    }
  }}
`;

// override inherited chart title styles
const modalStyles = css`
  font-weight: normal;
  line-height: 1.375;
  text-align: left;
`;

require('highcharts/modules/exporting')(Highcharts);

function EEREChart() {
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

  const hours = Array(hourlyEere.length)
    .fill(1)
    .map((_, i) => (i + 1).toString());

  const chartConfig: Highcharts.Options = {
    chart: {
      height: 300,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
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
        return `<span style="font-size: 10px">
          ${(this.series.xAxis as any).axisTitle.textStr}:
          ${this.x.toLocaleString()}
          </span><br/>
          <strong>${Math.round(this.y).toLocaleString()}</strong> MW`;
      },
    },
    lang: {
      contextButtonTitle: 'Export options',
    },
    xAxis: {
      categories: hours,
      title: {
        text: 'Hour of year',
      },
      labels: {
        formatter: function () {
          return this.value.toLocaleString();
        },
      },
    },
    yAxis: {
      title: {
        text: 'Change in load (MW)',
      },
      labels: {
        formatter: function () {
          return Math.round(this.value).toString();
        },
      },
    },
    series: [
      {
        type: 'line',
        name: 'EERE Load Output',
        data: hourlyEere,
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
    const totalLoadGwh = Math.round(totalLoadMwh / -1e3);

    // calculate the total equivalent number of american homes
    // (annual kwh of electricity used by the average american home is 12,146)
    const equivalentHomes = Math.round((totalLoadMwh / 12_146) * -1e3);

    chart = (
      <React.Fragment>
        <h3 className="avert-chart-title">
          EE/RE profile based on values entered:{' '}
          <span css={modalStyles}>
            <Tooltip id={10}>
              This graph shows the hourly changes in load that will result from
              the inputs entered above. It reflects a combination of all inputs,
              typical capacity factors for wind and solar, and adjustments for
              avoided transmission and distribution line loss, where applicable.
              This hourly EE/RE profile will be used to calculate the avoided
              emissions for this AVERT region.
            </Tooltip>
          </span>
        </h3>

        <h4 css={chartSubtitleStyles}>
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

        <p className="avert-small-text">
          This EE/RE profile will displace {totalLoadGwh.toLocaleString()} GWh
          of regional fossil fuel generation over the course of a year. For
          reference, this equals the annual electricity consumed by{' '}
          {equivalentHomes.toLocaleString()} average American homes.
        </p>
      </React.Fragment>
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
      <ValidationMessage type={type}>
        <span css={messageHeadingStyles}>{x.heading}:</span>
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
    <React.Fragment>
      {chart}
      {validationError}
      {validationWarning}
    </React.Fragment>
  );
}

export default EEREChart;
