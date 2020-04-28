import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// components
import Tooltip from 'app/components/Tooltip/Tooltip';
// reducers
import { useEereState } from 'app/redux/eere';
// styles
import './styles.css';

require('highcharts/modules/exporting')(Highcharts);

function EEREChart() {
  const {
    valid: softValid,
    topExceedanceValue: softTopExceedanceValue,
    topExceedanceTimestamp: softTopExceedanceTimestamp,
  } = useEereState(({ softLimit }) => softLimit);
  const {
    valid: hardValid,
    topExceedanceValue: hardTopExceedanceValue,
    topExceedanceTimestamp: hardTopExceedanceTimestamp,
  } = useEereState(({ hardLimit }) => hardLimit);
  const hourlyEere = useEereState(({ hourlyEere }) => hourlyEere);

  let data: number[] = [];
  let hours: string[] = [];
  hourlyEere.forEach((hour) => {
    data.push(hour.final_mw);
    hours.push(hour.index.toString());
  });

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
        // TODO: "(TITLE)" line below should be:
        // ${this.series.xAxis.axisTitle.textStr}:
        console.log(this.series.xAxis);

        return `<span style="font-size: 10px">
          (TITLE):
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
        data: data,
        color: '#058dc7',
      },
    ],
  };

  // boolean flag to render chart and error/warning when hourlyEere prop exits
  let readyToRender = hourlyEere.length > 0;

  let chart = null;
  // conditionally re-define chart when readyToRender (hourlyEere prop exists)
  if (readyToRender) {
    const totalLoadMwh = hourlyEere
      .map((hour) => hour.final_mw)
      .reduce((a, b) => a + b, 0);
    const totalLoadGwh = Math.round(totalLoadMwh / -1000).toLocaleString();

    chart = (
      <div className="avert-eere-profile">
        <h3 className="avert-chart-title">
          EE/RE profile based on values entered:{' '}
          <Tooltip id={8}>
            This graph shows the hourly changes in load that will result from
            the inputs entered above. It reflects a combination of all inputs,
            typical capacity factors for wind and solar, and adjustments for
            avoided transmission and distribution line loss, where applicable.
            This hourly EE/RE profile will be used to calculate the avoided
            emissions for this AVERT region.
          </Tooltip>
        </h3>

        <h4 className="avert-chart-subtitle">
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
          This EE/RE profile will displace {totalLoadGwh} GWh of regional fossil
          fuel generation over the course of a year.
        </p>
      </div>
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
    const hour = x.timestamp.hour > 12 ? x.timestamp.hour - 12 : x.timestamp.hour; // prettier-ignore
    const ampm = x.timestamp.hour > 12 ? 'PM' : 'AM';

    return (
      <p className={`avert-message-bottom avert-validation-${type}`}>
        <span className="avert-message-heading">{x.heading}:</span>
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
      </p>
    );
  }

  // set validationError when readyToRender and hardValid prop is false
  const validationError =
    readyToRender && !hardValid ? validationMessage('error') : null;

  // set validationWarning when readyToRender, softValid prop is false, and hardValid prop is true
  const validationWarning =
    readyToRender && !softValid && hardValid
      ? validationMessage('warning')
      : null;

  return (
    <div>
      {chart}
      {validationError}
      {validationWarning}
    </div>
  );
}

export default EEREChart;
