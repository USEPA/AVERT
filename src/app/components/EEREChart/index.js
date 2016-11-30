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
  validationError = (
    <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#eee', }}>
      <p className='avert-small-text' style={{ marginTop: '0', }}>
        {'ERROR:'}<br />
        {'Did second pass stay under 30%?'} <b>{ props.hardValid ? 'Yes': 'No' }</b>
        {` (Hour: ${props.hardTopExceedanceHour})`}
      </p>
    </div>
  );

  let validationWarning = null;
  validationWarning = (
    <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#eee', }}>
      <p className='avert-small-text' style={{ marginTop: '0', }}>
        {'WARNING:'}<br />
        {'Did second pass stay under 15%?'} <b>{ props.softValid ? 'Yes': 'No' }</b>
        {` (Hour: ${props.softTopExceedanceHour})`}
      </p>
    </div>
  )

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
