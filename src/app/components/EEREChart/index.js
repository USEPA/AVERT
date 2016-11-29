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

  return chart;
};

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default EEREChart;
