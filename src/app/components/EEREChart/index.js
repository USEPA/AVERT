import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
import NumberFormattingHelper from '../../utils/NumberFormattingHelper';

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
      text: props.heading,
      style: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#444',
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: hours,
      title: {
        text: 'Hour',
      },
    },
    yAxis: {
      title: {
        text: 'Change in load (MW)',
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
    chart = (
      <div className='avert-eere-profile'>
        <Highcharts config={chartConfig} />
      </div>
    );
  }

  let validationError = null;
  // conditionally re-define error when ready and hardValid prop is false
  if (ready && !props.hardValid) {
    validationError = (
      <p className='avert-message-bottom avert-validation-error'>
        <span className='avert-message-heading'>{'ERROR:'}</span>
        {'The combined impact of your proposed programs would displace up to '}
        <strong>{NumberFormattingHelper.twoDecimals(props.hardTopExceedance)}%</strong>
        {' of hourly regional fossil generation. The recommended limit for AVERT is 15%, as AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics. Please reduce one or more of your inputs to ensure more reliable results.'}
      </p>
    );
  }

  let validationWarning = null;
  // conditionally re-define warning when ready,
  // softValid prop is false, and hardValid prop is true
  if (ready && !props.softValid && props.hardValid) {
    validationWarning = (
      <p className='avert-message-bottom avert-validation-warning'>
        <span className='avert-message-heading'>{'WARNING:'}</span>
        {'The combined impact of your proposed programs would displace up to '}
        <strong>{NumberFormattingHelper.twoDecimals(props.softTopExceedance)}%</strong>
        {' of hourly regional fossil generation. The recommended limit for AVERT is 15%, as AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics. You may wish to reduce one or more of your inputs to ensure more reliable results.'}
      </p>
    );
  }

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
  // softTopExceedanceHour: PropTypes.string,
  // hardValid: PropTypes.string,
  // hardTopExceedanceHour: PropTypes.string,
};

export default EEREChart;
