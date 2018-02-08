import React from 'react';
// styles
import './styles.css';

const StepProgressItem = (props) => (
  <li className={ `avert-tab${props.step}` }>
    <a data-active={ `${props.active}` }>{ props.title }</a>
  </li>
);

// StepProgressItem.propTypes = {
//   step: PropTypes.number.isRequired,
//   active: PropTypes.bool.isRequired,
//   title: PropTypes.string.isRequired,
// };

export default StepProgressItem;
