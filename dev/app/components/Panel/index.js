import React, { PropTypes } from 'react';
// styles
import './styles.css';

const Panel = (props) => (
  <section className='avert-step' data-active={ `${props.active}` }>
    { props.children }
  </section>
);

Panel.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default Panel;
