import React, { PropTypes } from 'react';
// components
import StepProgressBar from '../StepProgressBar';
import StepPanels from '../StepPanels';
// styles
import './styles.css';

const App = (props) => (
  <div className='avert-container avert-copy'>
    <StepProgressBar activeTab={ props.activeStep } />
    <StepPanels activePanel={ props.activeStep } />
  </div>
);

App.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default App;
