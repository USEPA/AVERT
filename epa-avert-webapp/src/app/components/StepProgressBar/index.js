import React from 'react';
// components
import StepProgressItem from '../StepProgressItem';
// styles
import './styles.css';

const StepProgressBar = (props) => (
  <nav className='avert-nav'>
    <ol>
      <StepProgressItem step={ 1 } active={ props.activeTab === 1 ? true : false } title='Select Region' />
      <StepProgressItem step={ 2 } active={ props.activeTab === 2 ? true : false } title='Set EE/RE Impacts' />
      <StepProgressItem step={ 3 } active={ props.activeTab === 3 ? true : false } title='Get Results' />
    </ol>
  </nav>
);

// StepProgressBar.propTypes = {
//   activeTab: PropTypes.number.isRequired,
// };

export default StepProgressBar;
