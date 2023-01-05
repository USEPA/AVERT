/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
// ---
import { useTypedSelector } from 'app/redux/index';
import { setActiveStep } from 'app/redux/reducers/panel';
import { resetEEREInputs } from 'app/redux/reducers/eere';
import { fetchRegionsData } from 'app/redux/reducers/geography';
import {
  calculateDisplacement,
  resetDisplacement,
} from 'app/redux/reducers/displacement';
import { resetMonthlyEmissions } from 'app/redux/reducers/monthlyEmissions';
import { useSelectedRegion, useSelectedState } from 'app/hooks';
import icons from 'app/icons.svg';

const iconStyles = css`
  content: '';
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  background-image: url(${icons});
  background-size: 400px 200px;
  background-position: -36px -10px;
`;

const PrevButton = styled('a')`
  float: left;

  &::before {
    ${iconStyles};

    margin-right: 0.375rem;
    transform: rotate(180deg);
  }
`;

const NextButton = styled('a')<{ resultsShown: boolean }>`
  float: right;

  &::after {
    ${iconStyles};

    margin-left: 0.375rem;
  }

  /* if on the'Get Results' panel, use a reset icon instead of the arrow icon */
  ${({ resultsShown }) => {
    if (resultsShown) {
      return css`
        /* hide next icon */
        &::after {
          display: none;
        }

        /* reset icon */
        &::before {
          ${iconStyles};
          margin-right: 0.375rem;
          background-position: -56px -10px;
        }
      `;
    }
  }}
`;

export function PanelFooter(props: {
  prevButtonText?: string;
  nextButtonText: string;
}) {
  const { prevButtonText, nextButtonText } = props;

  const dispatch = useDispatch();

  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const eereStatus = useTypedSelector(({ eere }) => eere.status);
  const hardValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardValid,
  );

  const selectedRegionId = useSelectedRegion()?.id;
  const selectedStateId = useSelectedState()?.id;

  const onStepOne = activeStep === 1;
  const onStepTwo = activeStep === 2;
  const onStepThree = activeStep === 3;

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  const prevButton = !prevButtonText ? null : (
    <PrevButton
      className="usa-button avert-button"
      href="/"
      onClick={(ev) => {
        ev.preventDefault();
        scrollToTop();
        // prevButtonText isn't provided to first step's use of PanelFooter,
        // so we can safely always assume we're on step 2 or 3
        dispatch(setActiveStep(activeStep - 1));
        dispatch(resetEEREInputs());

        if (onStepThree) {
          dispatch(resetDisplacement());
          dispatch(resetMonthlyEmissions());
        }
      }}
    >
      {prevButtonText}
    </PrevButton>
  );

  const noRegionsSelected = onStepOne && !selectedRegionId;
  const noStateSelected = onStepOne && !selectedStateId;
  const noGeographySelected =
    geographicFocus === 'regions' ? noRegionsSelected : noStateSelected;

  const calculationRunning = onStepTwo && eereStatus !== 'complete';
  const exceedsHardValidationLimit = onStepTwo && !hardValid;

  const disabledButtonClassName =
    noGeographySelected || calculationRunning || exceedsHardValidationLimit
      ? 'avert-button-disabled'
      : '';

  const nextButton = (
    <NextButton
      resultsShown={onStepThree}
      className={`usa-button avert-button ${disabledButtonClassName}`}
      href="/"
      onClick={(ev) => {
        ev.preventDefault();

        if (noGeographySelected) return;

        if (onStepOne) {
          scrollToTop();
          dispatch(fetchRegionsData());
        }

        if (onStepTwo) {
          if (eereStatus === 'complete' && hardValid) {
            scrollToTop();
            dispatch(calculateDisplacement());
          } else {
            return;
          }
        }

        if (onStepThree) {
          scrollToTop();
          dispatch(resetEEREInputs());
          dispatch(resetDisplacement());
          dispatch(resetMonthlyEmissions());
        }

        dispatch(setActiveStep(onStepThree ? 1 : activeStep + 1));
      }}
    >
      {nextButtonText}
    </NextButton>
  );

  return (
    <div className="avert-step-footer overflow-hidden padding-105 bg-base-lightest">
      <p>
        {prevButton}
        {nextButton}
      </p>
    </div>
  );
}
