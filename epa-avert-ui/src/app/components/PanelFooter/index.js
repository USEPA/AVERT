import React, { PropTypes } from 'react';
// styles
import './styles.css';

const PanelFooter = (props) => {
  const onStepOne = props.activeStep === 1;
  const onStepTwo = props.activeStep === 2;
  const onStepThree = props.activeStep === 3;

  // smooth scroll to top
  const scrollToTop = (duration = 300) => {
    // const step = -window.scrollY / (duration / 16.666);
    // const interval = setInterval(() => {
    //   if (window.scrollY === 0) { clearInterval(interval) }
    //   window.scrollBy(0, step);
    // }, 16.666);

    scrollTo(0, 0);
  };

  // conditionally define prevButtonElement, if prevButtonText prop exists
  let prevButtonElement;
  if (props.prevButtonText) {
    prevButtonElement = (
      <a className='avert-button avert-prev' href=''
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();

          if (onStepTwo) { props.onResetEereInputs(); }

          const step = props.activeStep - 1;
          props.onSetActiveStep(step);
        }}
      >{ props.prevButtonText }</a>
    );
  }

  // conditionally define reset class, if on last panel
  const resetClass = onStepThree ? 'avert-reset-button' : '';

  const noRegionSelected = onStepOne && props.region === 0;
  const calculationRunning = onStepTwo && props.eereStatus !== 'complete';
  const validationFailed = onStepTwo && !props.hardValid;

  const disabledClass = (noRegionSelected || calculationRunning || validationFailed) ?
    'avert-button-disabled' : '';

  // define nextButtonElement
  const nextButtonElement = (
    <a
      className={`avert-button avert-next ${resetClass} ${disabledClass}`}
      href=''
      onClick={(e) => {
        e.preventDefault();

        if (noRegionSelected) { return; }

        if (onStepOne) {
          scrollToTop();
          props.onFetchRegion();
        }

        if (onStepTwo) {
          if (props.eereStatus === 'complete' && props.hardValid) {
            scrollToTop();
            props.onCalculateDisplacement();
          } else {
            return;
          }
        }

        if (onStepThree) {
          scrollToTop();
          props.onResetEereInputs();
          props.onResetMonthlyEmissions();
        }

        const step = onStepThree ? 1 : props.activeStep + 1;
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
  onResetMonthlyEmissions: PropTypes.func.isRequired,
  region: PropTypes.number.isRequired,
  eereStatus: PropTypes.string.isRequired,
  // hardValid: PropTypes.string,
  onCalculateDisplacement: PropTypes.func,
};

export default PanelFooter;
