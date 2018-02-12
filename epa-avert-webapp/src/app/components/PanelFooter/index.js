// @flow

import React from 'react';
// styles
import './styles.css';

type Props = {
  prevButtonText?: string,
  nextButtonText: string,
  // redux connected props
  activeStep: number,
  regionId: number,
  eereStatus: string,
  hardValid: boolean,
  onSetActiveStep: (number) => void,
  onFetchRegion: () => void,
  onCalculateDisplacement: () => void,
  onResetEereInputs: () => void,
  onResetMonthlyEmissions: () => void,

};

const PanelFooter = (props: Props) => {
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
    window.scrollTo(0, 0);
  };

  // conditionally define PrevButtonElement, if prevButtonText prop exists
  let PrevButtonElement;
  if (props.prevButtonText) {
    PrevButtonElement = (
      <a className='avert-button avert-prev' href=''
        onClick={(e) => {
          e.preventDefault();
          scrollToTop();

          if (onStepTwo) { props.onResetEereInputs(); }

          const step = props.activeStep - 1;
          props.onSetActiveStep(step);
        }}
      >
        {props.prevButtonText}
      </a>
    );
  }

  // conditionally define reset class, if on last panel
  const resetClass = onStepThree ? 'avert-reset-button' : '';

  const noRegionSelected = onStepOne && props.regionId === 0;
  const calculationRunning = onStepTwo && props.eereStatus !== 'complete';
  const exceedsHardValidationLimit = onStepTwo && !props.hardValid;

  const disabledClass = (noRegionSelected || calculationRunning || exceedsHardValidationLimit)
    ? 'avert-button-disabled'
    : '';

  // define NextButtonElement
  const NextButtonElement = (
    <a
      className={`avert-button avert-next ${resetClass} ${disabledClass}`}
      href=''
      onClick={(e) => {
        e.preventDefault();

        if (noRegionSelected) return;

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
    >
      {props.nextButtonText}
    </a>
  );

  return (
    <div className='avert-step-footer'>
      <p className='avert-centered'>
        {PrevButtonElement}
        {NextButtonElement}
      </p>
    </div>
  );
};

export default PanelFooter;
