import React, { PropTypes } from 'react';
// styles
import './styles.css';

const PanelBody = (props) => (
  <div className='avert-step-body'>
    <h2 className='avert-heading-two'>{ props.heading }</h2>
    { props.children }
  </div>
);

PanelBody.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default PanelBody;
