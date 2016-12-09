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

          if (props.activeStep === 2) { props.onResetEereInputs(); }

          const step = props.activeStep - 1;
          props.onSetActiveStep(step);
        }}
      >{ props.prevButtonText }</a>
    );
  }

  // conditionally define reset class, if on last panel
  const resetClass = props.activeStep === 3 ? 'avert-reset-button' : '';

  const stepOneDisabled = props.activeStep === 1 && props.region === 0;
  const stepTwoDisabled = props.activeStep === 2 && props.eereStatus !== 'complete';
  const stepTwoComplete = props.activeStep === 2 && props.eereStatus === 'complete'

  const disabledClass =
    // on step one w/out region selected, on step two w/out profile calculation
    (stepOneDisabled || stepTwoDisabled) ? 'avert-button-disabled' : '';

  // define nextButtonElement
  const nextButtonElement = (
    <a
      className={`avert-button avert-next ${resetClass} ${disabledClass}`}
      href=''
      onClick={(e) => {
        e.preventDefault();

        if (stepOneDisabled) { return; }
        if (stepTwoComplete) { props.onCalculateDisplacement(); }

        const step = props.activeStep === 3 ? 1 : props.activeStep + 1;
        props.onSetActiveStep(step);
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
  activeStep: PropTypes.number.isRequired,
  onSetActiveStep: PropTypes.func.isRequired,
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string.isRequired,
  onResetEereInputs: PropTypes.func.isRequired,
  region: PropTypes.number.isRequired,
  eereStatus: PropTypes.string.isRequired,
  onCalculateDisplacement: PropTypes.func,
};

export default PanelFooter;
