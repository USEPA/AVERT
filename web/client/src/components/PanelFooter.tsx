/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
// ---
import { useAppDispatch, useAppSelector } from "@/redux/index";
import { setActiveStep } from "@/redux/reducers/panel";
import { resetImpactsInputs } from "@/redux/reducers/impacts";
import { fetchRegionsData } from "@/redux/reducers/geography";
import { fetchEmissionsChanges, resetResults } from "@/redux/reducers/results";
import { resetMonthlyEmissions } from "@/redux/reducers/monthlyEmissions";
import { useSelectedRegion, useSelectedState } from "@/hooks";

const iconStyles = css`
  content: "";
  display: inline-block;
  width: 0.625rem;
  height: 0.625rem;
  background-image: url("/img/icons.svg");
  background-size: 400px 200px;
  background-position: -36px -10px;
`;

const PrevButtonAnchor = styled("a")`
  &::before {
    ${iconStyles};
    transform: rotate(180deg);
  }
`;

const NextButtonAnchor = styled("a")<{ resultsShown: boolean }>`
  &::after {
    ${iconStyles};
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

  const dispatch = useAppDispatch();
  const activeStep = useAppSelector(({ panel }) => panel.activeStep);

  const onStepThree = activeStep === 3;

  /**
   * if no button text is provided, render an empty element so the next button
   * is still floated right
   */
  if (!text) return <span />;

  return (
    <PrevButtonAnchor
      className={clsx("avert-button", "usa-button margin-0 margin-top-105")}
      href="/"
      onClick={(ev) => {
        ev.preventDefault();
        window.scrollTo(0, 0);
        // prevButtonText isn't provided to first step's use of PanelFooter,
        // so we can safely always assume we're on step 2 or 3
        dispatch(setActiveStep(activeStep - 1));
        dispatch(resetImpactsInputs());

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

  const dispatch = useAppDispatch();
  const activeStep = useAppSelector(({ panel }) => panel.activeStep);
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );

  const selectedRegionId = useSelectedRegion()?.id;
  const selectedStateId = useSelectedState()?.id;

  const onStepOne = activeStep === 1;
  const onStepTwo = activeStep === 2;
  const onStepThree = activeStep === 3;

  const noRegionsSelected = onStepOne && !selectedRegionId;
  const noStateSelected = onStepOne && !selectedStateId;
  const noGeographySelected =
    geographicFocus === "regions" ? noRegionsSelected : noStateSelected;

  const hourlyEnergyProfileInvalid =
    hourlyEnergyProfile.validation.lowerError !== null ||
    hourlyEnergyProfile.validation.upperError !== null;

  const hourlyEnergyProfileCalculationNotComplete =
    onStepTwo && hourlyEnergyProfile.status !== "success";

  const hourlyEnergyProfileExceedsValidationLimit =
    onStepTwo && hourlyEnergyProfileInvalid;

  /**
   * Recalculation of the hourly energy profile is needed if the impacts inputs
   * have changed from the ones used in the hourly energy profile calculation
   */
  const hourlyEnergyProfileRecalculationNeeded =
    onStepTwo &&
    !Object.keys(inputs).every((field) => {
      return (
        inputs[field as keyof typeof inputs] ===
        hourlyEnergyProfile.inputs[field as keyof typeof hourlyEnergyProfile.inputs] // prettier-ignore
      );
    });

  const disabledButtonClassName =
    noGeographySelected ||
    hourlyEnergyProfileCalculationNotComplete ||
    hourlyEnergyProfileExceedsValidationLimit ||
    hourlyEnergyProfileRecalculationNeeded
      ? "avert-button-disabled"
      : "";

  return (
    <NextButtonAnchor
      resultsShown={onStepThree}
      className={clsx(
        "avert-button",
        "usa-button order-last margin-0 margin-top-105",
        disabledButtonClassName,
      )}
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
            hourlyEnergyProfile.status === "success" &&
            !hourlyEnergyProfileRecalculationNeeded &&
            !hourlyEnergyProfileInvalid
          ) {
            window.scrollTo(0, 0);
            dispatch(fetchEmissionsChanges());
          } else {
            return;
          }
        }

        if (onStepThree) {
          window.scrollTo(0, 0);
          dispatch(resetImpactsInputs());
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
    <div
      className={clsx(
        "avert-step-footer",
        "overflow-hidden padding-x-105 padding-bottom-105 bg-base-lightest",
      )}
    >
      <p
        className={clsx(
          "margin-0",
          "mobile-lg:display-flex mobile-lg:flex-justify",
        )}
      >
        <NextButton text={nextButton} />
        <PrevButton text={prevButton} />
      </p>
    </div>
  );
}
