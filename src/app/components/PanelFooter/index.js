import React, { PropTypes } from 'react';
// styles
import './styles.css';

const PanelFooter = (props) => {
  // conditionally define prevButtonElement, if prevButtonText prop exists
  let prevButtonElement;

  if (props.prevButtonText) {
    prevButtonElement = (
      <a className='avert-button avert-prev' href=''
        onClick={(e) => {
          e.preventDefault();
          const step = props.activeStep - 1;
          props.onButtonClick(step);
        }}
      >{ props.prevButtonText }</a>
    );
  }

  // conditionally define reset class, if on last panel
  const resetClass = props.lastPanel ? 'avert-reset-button' : '';

  const nextButtonElement = (
    <a className={`avert-button avert-next ${resetClass}`} href=''
      onClick={(e) => {
        e.preventDefault();
        const step = props.lastPanel ? 1 : props.activeStep + 1;
        props.onButtonClick(step);
      }}
    >{ props.nextButtonText }</a>
  );

  return (
    <div className='avert-step-footer'>
      <p className='avert-centered'>
        { prevButtonElement }
        { nextButtonElement }
      </p>
    </div>
  );
};

PanelFooter.propTypes = {
  lastPanel: PropTypes.bool,
  activeStep: PropTypes.number.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string.isRequired,
};

export default PanelFooter;
