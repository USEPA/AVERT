/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { useDispatch } from 'react-redux';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { setActiveStep } from 'app/redux/reducers/panel';
import { resetEereInputs } from 'app/redux/reducers/eere';
import { fetchRegionsData } from 'app/redux/reducers/geography';
import {
  calculateDisplacement,
  resetDisplacement,
} from 'app/redux/reducers/displacement';
import { resetStateEmissions } from 'app/redux/reducers/stateEmissions';
import { resetMonthlyEmissions } from 'app/redux/reducers/monthlyEmissions';
// hooks
import { useSelectedRegions, useSelectedState } from 'app/hooks';
// icons
import icons from 'app/icons.svg';

const footerStyles = css`
  overflow: hidden;
  padding: 0.75rem;
  background: #eee;
`;

const buttonsStyles = css`
  margin-top: 0;
`;

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
        background-color: rgb(146, 193, 47) !important;

        &:hover {
          background-color: rgb(159, 207, 58) !important;
        }

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

type Props = {
  prevButtonText?: string;
  nextButtonText: string;
};

function PanelFooter({ prevButtonText, nextButtonText }: Props) {
  const dispatch = useDispatch();

  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const eereStatus = useTypedSelector(({ eere }) => eere.status);
  const hardValid = useTypedSelector(({ eere }) => eere.hardLimit.valid);

  const selectedRegionIds = useSelectedRegions().map((region) => region.id);
  const selectedStateId = useSelectedState()?.id;

  const onStepOne = activeStep === 1;
  const onStepTwo = activeStep === 2;
  const onStepThree = activeStep === 3;

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  const prevButton = !prevButtonText ? null : (
    <PrevButton
      className="avert-button"
      href="/"
      onClick={(ev) => {
        ev.preventDefault();
        scrollToTop();
        // prevButtonText isn't provided to first step's use of PanelFooter,
        // so we can safely always assume we're on step 2 or 3
        dispatch(setActiveStep(activeStep - 1));
        dispatch(resetEereInputs());

        if (onStepThree) {
          dispatch(resetDisplacement());
          dispatch(resetStateEmissions());
          dispatch(resetMonthlyEmissions());
        }
      }}
    >
      {prevButtonText}
    </PrevButton>
  );

  const noRegionsSelected = onStepOne && selectedRegionIds.length === 0;
  const noStateSelected = onStepOne && !selectedStateId;
  const noGeographySelected =
    geographicFocus === 'regions' ? noRegionsSelected : noStateSelected;

  const calculationRunning = onStepTwo && eereStatus !== 'complete';
  const exceedsHardValidationLimit = onStepTwo && !hardValid;

  const disabledClass =
    noGeographySelected || calculationRunning || exceedsHardValidationLimit
      ? 'avert-button-disabled'
      : '';

  const nextButton = (
    <NextButton
      resultsShown={onStepThree}
      className={`avert-button ${disabledClass}`}
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
          dispatch(resetEereInputs());
          dispatch(resetDisplacement());
          dispatch(resetStateEmissions());
          dispatch(resetMonthlyEmissions());
        }

        dispatch(setActiveStep(onStepThree ? 1 : activeStep + 1));
      }}
    >
      {nextButtonText}
    </NextButton>
  );

  return (
    <div css={footerStyles} className="avert-step-footer">
      <p css={buttonsStyles} className="avert-centered">
        {prevButton}
        {nextButton}
      </p>
    </div>
  );
}

export default PanelFooter;
