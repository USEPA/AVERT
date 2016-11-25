import React , { PropTypes } from 'react';
// containers
import EERETableContainer from '../../containers/EERETableContainer';
// utilities
import statusEnum from '../../utils/statusEnum';

const EEREChart = (props) => {
  const disabledClass = () => {
    if (statusEnum[props.eere_status].submitted) {
      return 'avert-button-disabled';
    } else {
      return '';
    }
  };

  return(
    <div className='avert-eere-profile'>
      <h3 className='avert-heading-three'>{ props.heading }</h3>

      <a className={`avert-button ${disabledClass()}`} href=''
        onClick={(e) => {
          e.preventDefault();
          props.onCalculateProfile()
        }}
      >
        { statusEnum[props.eere_status].lang }
      </a>

      {/* EERETable is temporary until we hook up Highcharts */}
      <EERETableContainer />
    </div>
  );
};

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
  eere_status: PropTypes.string.isRequired,
  onCalculateProfile: PropTypes.func.isRequired,
};

export default EEREChart;
