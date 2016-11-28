import React , { Component, PropTypes } from 'react';
import Highcharts from 'react-highcharts';
// utilities
import statusEnum from '../../utils/statusEnum';

class EEREChart extends Component {
  render(){
    const disabledClass = () => {
      if (statusEnum[this.props.eere_status].submitted) {
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

        {/*
        <table className="avert-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Current Load (MW)</th>
              <th>Manual EERE Entry</th>
              <th>Constant</th>
              <th>Percent</th>
              <th>Renewable Energy Profile</th>
              <th>Final (MW)</th>
              <th>Limit</th>
              <th>Exceedance</th>
            </tr>
          </thead>
          <tbody>
            {this.props.hourlyEere.map((item, index) => (
              <tr key={ index }>
                <td>{ item.index + 1 }</td>
                <td>{ item.current_load_mw }</td>
                <td>{ item.manual_eere_entry }</td>
                <td>{ item.constant }</td>
                <td>{ item.percent }</td>
                <td>{ item.renewable_energy_profile }</td>
                <td>{ item.final_mw }</td>
                <td>{ item.limit }</td>
                <td>{ item.exceedance }</td>
              </tr>
            ))}
          </tbody>
        </table>
        */}
      </div>
    );
  };
}

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
  eere_status: PropTypes.string.isRequired,
  onCalculateProfile: PropTypes.func.isRequired,
};

export default EEREChart;
