import React, { PropTypes } from 'react';
// components
import ProgressTab from '../ProgressTab';
// styles
import './styles.css';

const ProgressBar = (props) => (
  <nav className='avert-nav'>
    <ol>
      <ProgressTab step={ 1 } active={ props.activeTab === 1 ? true : false } title='Select Region' />
      <ProgressTab step={ 2 } active={ props.activeTab === 2 ? true : false } title='Set EE/RE Impacts' />
      <ProgressTab step={ 3 } active={ props.activeTab === 3 ? true : false } title='Get Results' />
    </ol>
  </nav>
);

ProgressBar.propTypes = {
  activeTab: PropTypes.number.isRequired,
};

export default ProgressBar;
