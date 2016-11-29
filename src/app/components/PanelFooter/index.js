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
          props.onSetActiveStep(step);
        }}
      >{ props.prevButtonText }</a>
    );
  }

  // conditionally define reset class, if on last panel
  const resetClass = props.lastPanel ? 'avert-reset-button' : '';
  // conditionally define disabled class, if nextDisabled state is truthy
  const disabledClass = props.nextDisabled ? 'avert-button-disabled' : '';
  // define nextButtonElement
  const nextButtonElement = (
    <a
      className={`avert-button avert-next ${resetClass} ${disabledClass}`}
      href=''
      onClick={(e) => {
        e.preventDefault();
        // if not disabled, change step
        if (!props.nextDisabled) {
          const step = props.lastPanel ? 1 : props.activeStep + 1;
          props.onSetActiveStep(step);
          // if on second step, calculate displacement
          if (props.activeStep === 2) { props.onCalculateDisplacement() }
        }
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
  onSetActiveStep: PropTypes.func.isRequired,
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string.isRequired,
  nextDisabled: PropTypes.bool,
  onCalculateDisplacement: PropTypes.func,
};

export default PanelFooter;
