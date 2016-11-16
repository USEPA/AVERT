import React, { PropTypes } from 'react';
// styles
import './styles.css';

const ProgressTab = (props) => (
  <li className={ `avert-tab${props.step}` }>
    <a data-active={ `${props.active}` }>{ props.title }</a>
  </li>
);

ProgressTab.propTypes = {
  step: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default ProgressTab;
