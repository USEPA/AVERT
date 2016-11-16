import React, { PropTypes } from 'react';
// components
import ProgressBar from '../ProgressBar';
import Panels from '../Panels';
// styles
import './styles.css';

const App = (props) => (
  <div className='avert-container avert-copy'>
    <ProgressBar activeTab={ props.activeStep } />
    <Panels activePanel={ props.activeStep } />
  </div>
);

App.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default App;
