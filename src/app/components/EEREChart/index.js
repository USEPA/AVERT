import React, { PropTypes } from 'react';
import Highcharts from 'react-highcharts';
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
    },
    yAxis: {
      title: {
        text: false,
      },
    },
    series: [{
      name: 'EERE Load Output',
      data: data,
      color: '#058dc7',
    }],
  };

  // conditionally define chart if hourlyEere prop exists
  let chart = null;
  if (props.hourlyEere.length > 0) {
    chart = (
      <div className='avert-eere-profile'>
        <Highcharts config={chartConfig} />
      </div>
    );
  }

  let validationError = null;
  if (!props.hardValid) {
    validationError = (
      <p className='avert-validation-error'>
        <span className='avert-validation-heading'>{'ERROR:'}</span>
        {'The combined impact of your proposed programs would displace up to '}
        <strong>{props.hardTopExceedanceHour}</strong>
        {' of hourly regional fossil generation. The recommended limit for AVERT is 15%, as AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics. Please reduce one or more of your inputs to ensure more reliable results.'}
      </p>
    );
  }

  let validationWarning = null;
  if (!props.softValid && props.hardValid) {
    validationWarning = (
      <p className='avert-validation-warning'>
        <span className='avert-validation-heading'>{'WARNING:'}</span>
        {'The combined impact of your proposed programs would displace up to '}
        <strong>{props.softTopExceedanceHour}</strong>
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
  // softValid: PropTypes.string,
  // softTopExceedanceHour: PropTypes.string,
  // hardValid: PropTypes.string,
  // hardTopExceedanceHour: PropTypes.string,
};

export default EEREChart;
