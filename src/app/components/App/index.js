import React, { PropTypes } from 'react';
// components
import StepProgressBar from '../StepProgressBar';
// containers
import StepPanelsContainer from '../../containers/StepPanelsContainer';
// styles
import './styles.css';

const App = (props) => (
  <div className='avert-container avert-copy'>
    <StepProgressBar activeTab={ props.activeStep } />
    <StepPanelsContainer activePanel={ props.activeStep } />
  </div>
);

App.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default App;
