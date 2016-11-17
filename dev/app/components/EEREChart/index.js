import React , { PropTypes } from 'react';

const EEREChart = (props) => (
  <div className='avert-eere-profile'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>
    <img src='//www.placehold.it/670x300' alt='' />
  </div>
);

EEREChart.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default EEREChart;
