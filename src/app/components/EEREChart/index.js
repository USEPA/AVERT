import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// containers
import TooltipContainer from '../../containers/TooltipContainer';
// utilities
import NumberFormattingHelper from '../../utils/NumberFormattingHelper';
// styles
import './styles.css';

const EEREChart = (props) => {
  const data = props.hourlyEere.map((hour) => hour.final_mw);
  const hours = props.hourlyEere.map((hour, index) => index);
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
        return (
          `<span style="font-size: 10px">Hour of year:
          ${this.x.toLocaleString()}</span><br/>
          <span style="color:${this.color}">\u25CF</span>
          ${this.series.yAxis.axisTitle.textStr}
          <b>${Math.round(this.y).toLocaleString()}</b><br/>`
        )
      },
    },
    lang: {
      hoverText: 'Export options',
    },
    exporting: {
      buttons: {
        contextButton: {
          _titleKey: 'hoverText',
        }
      },
    },
    xAxis: {
      categories: hours,
      title: {
        text: 'Hour',
      },
      labels: {
        formatter: function() { return this.value.toLocaleString() },
      },
    },
    yAxis: {
      title: {
        text: 'Change in load (MW)',
      },
      labels: {
        formatter: function() { return Math.round(this.value) },
      },
    },
    series: [{
      name: 'EERE Load Output',
      data: data,
      color: '#058dc7',
    }],
  };

  // boolean flag to render chart and error/warning when hourlyEere prop exits
  let ready = props.hourlyEere.length > 0;

  let chart = null;
  // conditionally re-define chart when ready (hourlyEere prop exists)
  if (ready) {
    const totalLoadMw = props.hourlyEere
      .map((hour) => hour.final_mw)
      .reduce((a, b) => a + b, 0);
    const totalLoadGwh = Math.round(totalLoadMw / -1000).toLocaleString();

    chart = (
      <div className='avert-eere-profile'>
        <h3 className='avert-chart-title'>
          { props.heading }
          {' '}
          <TooltipContainer id={8}>
            {'This graph shows the hourly changes in load that will result from the inputs entered above. This hourly EE/RE profile will be used to calculate the avoided emissions for this AVERT region.'}
          </TooltipContainer>
        </h3>

        <Highcharts config={chartConfig} />

        <p className="avert-small-text">
          {`This EE/RE profile will displace ${totalLoadGwh} GWh of regional fossil fuel generation over the course of a year.`}
        </p>
      </div>
    );
  }

  const validationMessage = (input) => {
    let x = {};
    if (input === 'error') {
      x.timestamp = props.hardTopExceedanceTimestamp;
      x.exceedence = props.hardTopExceedance;
      x.heading = 'ERROR';
      x.threshold = '30';
    }
    if (input === 'warning') {
      x.timestamp = props.softTopExceedanceTimestamp;
      x.exceedence = props.softTopExceedance;
      x.heading = 'WARNING';
      x.threshold = '15';
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[x.timestamp.month - 1];
    const day = x.timestamp.day;
    const hour = x.timestamp.hour > 12 ? x.timestamp.hour - 12 : x.timestamp.hour;
    const ampm = x.timestamp.hour > 12 ? 'PM' : 'AM';

    return (
      <p className={`avert-message-bottom avert-validation-${input}`}>
        <span className='avert-message-heading'>{`${x.heading}:`}</span>
        {'The combined impact of your proposed programs would displace more than '}
        <strong>{`${x.threshold}%`}</strong>
        {' of regional fossil generation in at least one hour of the year. (Maximum value: '}
        <strong>{NumberFormattingHelper.twoDecimals(x.exceedence)}</strong>
        {'% on '}
        <strong>{`${month} ${day} at ${hour}:00 ${ampm}`}</strong>
        {'). The recommended limit for AVERT is 15%, as AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics. Please reduce one or more of your inputs to ensure more reliable results.'}
      </p>
    );
  };

  // set validationError when ready and hardValid prop is false
  const validationError = (ready && !props.hardValid) ? validationMessage('error') : null;

  // set validationWarning when ready, softValid prop is false, and hardValid prop is true
  const validationWarning = (ready && !props.softValid && props.hardValid) ? validationMessage('warning') : null;

  return (
    <div>
      { chart }
      { validationError }
      { validationWarning }
    </div>
  );
};

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
  hourlyEere: PropTypes.array.isRequired,
  // softValid: PropTypes.string,
  // softTopExceedanceTimestamp: PropTypes.string,
  // hardValid: PropTypes.string,
  // hardTopExceedanceTimestamp: PropTypes.string,
};

export default EEREChart;
