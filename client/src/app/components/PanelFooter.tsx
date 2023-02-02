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
  fetchEmissionsChanges,
  resetResults,
} from 'app/redux/reducers/results';
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
  const eereInputs = useTypedSelector(({ eere }) => eere.inputs);
  const eereProfileCalculationStatus = useTypedSelector(
    ({ eere }) => eere.profileCalculationStatus,
  );
  const eereProfileCalculationInputs = useTypedSelector(
    ({ eere }) => eere.profileCalculationInputs,
  );
  const eereHardValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardValid,
  );

  const selectedRegionId = useSelectedRegion()?.id;
  const selectedStateId = useSelectedState()?.id;

  const onStepOne = activeStep === 1;
  const onStepTwo = activeStep === 2;
  const onStepThree = activeStep === 3;

  const noRegionsSelected = onStepOne && !selectedRegionId;
  const noStateSelected = onStepOne && !selectedStateId;
  const noGeographySelected =
    geographicFocus === 'regions' ? noRegionsSelected : noStateSelected;

  /**
   * Recalculation of the EERE profile is needed if the EERE inputs have changed
   * from the ones used in the EERE profile calculation
   */
  const eereProfileRecalculationNeeded =
    onStepTwo &&
    !Object.keys(eereInputs).every((field) => {
      return (
        eereInputs[field as keyof typeof eereInputs] ===
        eereProfileCalculationInputs[field as keyof typeof eereProfileCalculationInputs] // prettier-ignore
      );
    });

  const eereProfileCalculationNotComplete =
    onStepTwo && eereProfileCalculationStatus !== 'success';

  const eereProfileExceedsHardValidationLimit = onStepTwo && !eereHardValid;

  const disabledButtonClassName =
    noGeographySelected ||
    eereProfileCalculationNotComplete ||
    eereProfileRecalculationNeeded ||
    eereProfileExceedsHardValidationLimit
      ? 'avert-button-disabled'
      : '';

  const prevButton = !prevButtonText ? null : (
    <PrevButton
      className="usa-button avert-button"
      href="/"
      onClick={(ev) => {
        ev.preventDefault();
        window.scrollTo(0, 0);
        // prevButtonText isn't provided to first step's use of PanelFooter,
        // so we can safely always assume we're on step 2 or 3
        dispatch(setActiveStep(activeStep - 1));
        dispatch(resetEEREInputs());

        if (onStepThree) {
          dispatch(resetResults());
          dispatch(resetMonthlyEmissions());
        }
      }}
    >
      {prevButtonText}
    </PrevButton>
  );

  const nextButton = (
    <NextButton
      resultsShown={onStepThree}
      className={`usa-button avert-button ${disabledButtonClassName}`}
      href="/"
      onClick={(ev) => {
        ev.preventDefault();

        if (noGeographySelected) return;

        if (onStepOne) {
          window.scrollTo(0, 0);
          dispatch(fetchRegionsData());
        }

        if (onStepTwo) {
          if (
            eereProfileCalculationStatus === 'success' &&
            !eereProfileRecalculationNeeded &&
            eereHardValid
          ) {
            window.scrollTo(0, 0);
            dispatch(fetchEmissionsChanges());
          } else {
            return;
          }
        }

        if (onStepThree) {
          window.scrollTo(0, 0);
          dispatch(resetEEREInputs());
          dispatch(resetResults());
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
