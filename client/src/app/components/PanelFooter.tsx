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

const PrevButtonAnchor = styled('a')`
  &::before {
    ${iconStyles};

    margin-right: 0.375rem;
    transform: rotate(180deg);
  }
`;

const NextButtonAnchor = styled('a')<{ resultsShown: boolean }>`
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

function PrevButton(props: { text: string | null }) {
  const { text } = props;

  const dispatch = useDispatch();
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);

  const onStepThree = activeStep === 3;

  /**
   * if no button text is provided, render an empty element so the next button
   * is still floated right
   */
  if (!text) return <span />;

  return (
    <PrevButtonAnchor
      className="usa-button avert-button margin-0 margin-top-105"
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
      {text}
    </PrevButtonAnchor>
  );
}

function NextButton(props: { text: string }) {
  const { text } = props;

  const dispatch = useDispatch();
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const eereInputs = useTypedSelector(({ eere }) => eere.inputs);
  const hourlyImpacts = useTypedSelector(({ eere }) => eere.hourlyImpacts);

  const selectedRegionId = useSelectedRegion()?.id;
  const selectedStateId = useSelectedState()?.id;

  const onStepOne = activeStep === 1;
  const onStepTwo = activeStep === 2;
  const onStepThree = activeStep === 3;

  const noRegionsSelected = onStepOne && !selectedRegionId;
  const noStateSelected = onStepOne && !selectedStateId;
  const noGeographySelected =
    geographicFocus === 'regions' ? noRegionsSelected : noStateSelected;

  const eereProfileInvalid =
    hourlyImpacts.validation.lowerError !== null ||
    hourlyImpacts.validation.upperError !== null;

  const eereProfileCalculationNotComplete =
    onStepTwo && hourlyImpacts.status !== 'success';

  const eereProfileExceedsValidationLimit = onStepTwo && eereProfileInvalid;

  /**
   * Recalculation of the EERE profile is needed if the EERE inputs have changed
   * from the ones used in the EERE profile calculation
   */
  const eereProfileRecalculationNeeded =
    onStepTwo &&
    !Object.keys(eereInputs).every((field) => {
      return (
        eereInputs[field as keyof typeof eereInputs] ===
        hourlyImpacts.inputs[field as keyof typeof hourlyImpacts.inputs]
      );
    });

  const disabledButtonClassName =
    noGeographySelected ||
    eereProfileCalculationNotComplete ||
    eereProfileExceedsValidationLimit ||
    eereProfileRecalculationNeeded
      ? 'avert-button-disabled'
      : '';

  return (
    <NextButtonAnchor
      resultsShown={onStepThree}
      className={`usa-button avert-button order-last margin-0 margin-top-105 ${disabledButtonClassName}`}
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
            hourlyImpacts.status === 'success' &&
            !eereProfileRecalculationNeeded &&
            !eereProfileInvalid
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
      {text}
    </NextButtonAnchor>
  );
}

export function PanelFooter(props: {
  prevButton: string | null;
  nextButton: string;
}) {
  const { prevButton, nextButton } = props;

  return (
    <div className="avert-step-footer overflow-hidden padding-x-105 padding-bottom-105 bg-base-lightest">
      <p className="margin-0 mobile-lg:display-flex mobile-lg:flex-justify">
        <NextButton text={nextButton} />
        <PrevButton text={prevButton} />
      </p>
    </div>
  );
}
