// @flow

import React from 'react';
import Highcharts from 'react-highcharts';
// components
import Tooltip from 'app/components/Tooltip/container.js';
// styles
import './styles.css';

const formatNumber = (number) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

type Timestamp = {
  hour_of_year: number,
  year: number,
  month: number,
  day: number,
  hour: number,
  regional_load_mw: number,
  hourly_limit: number,
};

type Eere = {
  index: number,
  constant: number,
  current_load_mw: number,
  percent: number,
  final_mw: number,
  renewable_energy_profile: number,
  soft_limit: number,
  hard_limit: number,
  soft_exceedance: number,
  hard_exceedance: number,
};

type Props = {
  heading: string,
  // redux connected props
  softValid: boolean,
  softTopExceedanceValue: number,
  softTopExceedanceTimestamp: Timestamp,
  hardValid: boolean,
  hardTopExceedanceValue: number,
  hardTopExceedanceTimestamp: Timestamp,
  hourlyEere: Array<Eere>,
};

const EEREChart = (props: Props) => {
  let data = [];
  let hours = [];
  props.hourlyEere.forEach((hour) => {
    data.push(hour.final_mw);
    hours.push(hour.index);
  });

  const chartConfig = {
    chart: {
      height: 300,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
    },
    title: {
      text: null,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function() {
        return `<span style="font-size: 10px">Hour of year:
          ${this.x.toLocaleString()}</span><br/>
          <span style="color:${this.color}">\u25CF</span>
          ${this.series.yAxis.axisTitle.textStr}
          <b>${Math.round(this.y).toLocaleString()}</b><br/>`;
      },
    },
    lang: {
      hoverText: 'Export options',
    },
    exporting: {
      buttons: {
        contextButton: {
          _titleKey: 'hoverText',
        },
      },
    },
    xAxis: {
      categories: hours,
      title: {
        text: 'Hour',
      },
      labels: {
        formatter: function() {
          return this.value.toLocaleString();
        },
      },
    },
    yAxis: {
      title: {
        text: 'Change in load (MW)',
      },
      labels: {
        formatter: function() {
          return Math.round(this.value);
        },
      },
    },
    series: [
      {
        name: 'EERE Load Output',
        data: data,
        color: '#058dc7',
      },
    ],
  };

  // boolean flag to render chart and error/warning when hourlyEere prop exits
  let readyToRender = props.hourlyEere.length > 0;

  // callback for after highcharts chart renders
  const afterRender = (chart) => {
    // as this entire react app is ultimately served in an iframe on another page,
    // this document has a click handler that sends document's height to other window,
    // which can then set the embedded iframe's height (see public/post-message.js)
    //$FlowFixMe: surpressing Flow error
    document.querySelector('html').click();
  };

  let Chart = null;
  // conditionally re-define Chart when readyToRender (hourlyEere prop exists)
  if (readyToRender) {
    const totalLoadMwh = props.hourlyEere
      .map((hour) => hour.final_mw)
      .reduce((a, b) => a + b, 0);
    const totalLoadGwh = Math.round(totalLoadMwh / -1000).toLocaleString();

    Chart = (
      <div className="avert-eere-profile">
        <h3 className="avert-chart-title">
          {props.heading}{' '}
          <Tooltip id={8}>
            This graph shows the hourly changes in load that will result from
            the inputs entered above, along with adjustments for avoided
            transmission and distribution line loss, where applicable. This
            hourly EE/RE profile will be used to calculate the avoided emissions
            for this AVERT region.
          </Tooltip>
        </h3>

        <Highcharts config={chartConfig} callback={afterRender} />

        <p className="avert-small-text">
          This EE/RE profile will displace {totalLoadGwh} GWh of regional fossil
          fuel generation over the course of a year.
        </p>
      </div>
    );
  }

  const ValidationMessage = (type) => {
    let x = {};
    if (type === 'error') {
      x.heading = 'ERROR';
      x.threshold = '30';
      x.value = props.hardTopExceedanceValue;
      x.timestamp = props.hardTopExceedanceTimestamp;
    }
    if (type === 'warning') {
      x.heading = 'WARNING';
      x.threshold = '15';
      x.value = props.softTopExceedanceValue;
      x.timestamp = props.softTopExceedanceTimestamp;
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
        <strong>{formatNumber(x.value)}</strong>% on{' '}
        <strong>
          {month} {day} at {hour}:00 {ampm}
        </strong>). The recommended limit for AVERT is 15%, as AVERT is designed
        to simulate marginal operational changes in load, rather than
        large-scale changes that may change fundamental dynamics. Please reduce
        one or more of your inputs to ensure more reliable results.
      </p>
    );
  };

  // prettier-ignore
  // set ValidationError when readyToRender and hardValid prop is false
  const ValidationError = (readyToRender && !props.hardValid)
    ? ValidationMessage('error')
    : null;

  // prettier-ignore
  // set ValidationWarning when readyToRender, softValid prop is false, and hardValid prop is true
  const ValidationWarning = (readyToRender && !props.softValid && props.hardValid)
    ? ValidationMessage('warning')
    : null;

  return (
    <div>
      {Chart}
      {ValidationError}
      {ValidationWarning}
    </div>
  );
};

export default EEREChart;
