import React , { Component, PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// utilities
import statusEnum from '../../utils/statusEnum';

class EEREChart extends Component {
  render(){
    const disabledClass = () => {
      if (statusEnum[this.props.eere_status].submitted || ! this.props.valid) {
        return 'avert-button-disabled';
      } else {
        return '';
      }
    };

    const data = this.props.hourlyEere.map((hour) => hour.final_mw);
    const hours = this.props.hourlyEere.map((hour, index) => index);
    const chartConfig = {
      chart: {
        height: 300,
        style: {
          fontFamily: '"Open Sans", sans-serif',
        },
      },
      title: {
        text: 'EERE Load Output',
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

    return (
      <div className='avert-eere-profile'>
        <h3 className='avert-heading-three'>{ this.props.heading }</h3>

        <a className={`avert-button ${disabledClass()}`} href=''
          onClick={(e) => {
            e.preventDefault();
            this.props.onCalculateProfile()
          }}
        >
          { statusEnum[this.props.eere_status].lang }
        </a>

        <Highcharts config={chartConfig} ref='eere-profile' />
      </div>
    );
  };
}

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
  eere_status: PropTypes.string.isRequired,
  onCalculateProfile: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default EEREChart;
