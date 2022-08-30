/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// components
import { EEREInputField } from 'app/components/EEREInputField';
import Tooltip from 'app/components/Tooltip';
// reducers
import { useTypedSelector } from 'app/redux/index';
import {
  updateEereAnnualGwh,
  updateEereConstantMw,
  updateEereBroadBasedProgram,
  updateEereReduction,
  updateEereTopHours,
  updateEereOnshoreWind,
  updateEereOffshoreWind,
  updateEereUtilitySolar,
  updateEereRooftopSolar,
  calculateEereProfile,
} from 'app/redux/reducers/eere';
// hooks
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

const inputsBlockStyles = css`
  margin: 1rem 0;
  border-top: 1px solid #ccc;

  & :is(p, ul, li) {
    margin-top: 0 !important;
    font-size: 0.625rem;
  }

  @media (min-width: 25em) {
    & :is(p, ul, li) {
      font-size: 0.6875rem;
    }
  }

  @media (min-width: 30em) {
    & :is(p, ul, li) {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 35em) {
    & :is(p, ul, li) {
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 40em) {
    & :is(p, ul, li) {
      font-size: 0.875rem;
    }
  }
`;

const inputsCategoryStyles = css`
  overflow: hidden;
  border: 1px solid #ccc;
  border-top: 0;
  padding: 0.5rem 0.625rem;
  font-weight: bold;
  background-color: #eee;
`;

const inputsGroupStyles = css`
  display: block; /* IE */
  overflow: hidden;
  border: 1px solid #ccc;
  border-top: 0;

  /* highlight letter when details is open */
  /* (summary is styled with inputsLabelStyles) */
  &[open] > summary::after {
    background-color: rgb(0, 164, 200);
  }
`;

const inputsLabelStyles = css`
  display: block; /* IE */
  padding: 1rem 0.5rem;
  font-size: 0.625rem;
  font-weight: bold;
  cursor: pointer;

  @media (min-width: 25em) {
    font-size: 0.6875rem;
  }

  @media (min-width: 30em) {
    font-size: 0.75rem;
  }

  @media (min-width: 35em) {
    font-size: 0.8125rem;
  }

  @media (min-width: 40em) {
    font-size: 0.875rem;
  }

  /* letter (A, B, C, or D) */
  &::after {
    content: attr(data-label);
    float: left;
    margin-top: -0.375rem;
    margin-right: 0.5rem;
    border-radius: 3px;
    width: 1.25rem;
    font-size: 1rem;
    text-align: center;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.125);
    color: white;
    background-color: #aaa;

    @media (min-width: 25em) {
      width: 1.375rem;
      font-size: 1.125rem;
    }

    @media (min-width: 30em) {
      width: 1.5rem;
      font-size: 1.25rem;
    }

    @media (min-width: 35em) {
      width: 1.625rem;
      font-size: 1.375rem;
    }

    @media (min-width: 40em) {
      width: 1.75rem;
      font-size: 1.5rem;
    }
  }

  /* highlight letter on hover */
  &:hover::after {
    background-color: rgb(0, 164, 200);
  }
`;

const inputsContentStyles = css`
  padding: 0.5rem 0.625rem;
`;

const inputLabelStyles = css`
  display: block;

  @media (min-width: 35em) {
    display: inline;
  }
`;

const impactsButtonStyles = css`
  text-align: center;
  margin-bottom: 1rem;
`;

function EEREInputs() {
  const dispatch = useDispatch();
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const status = useTypedSelector(({ eere }) => eere.status);
  const errors = useTypedSelector(({ eere }) => eere.errors);
  const constantMwh = useTypedSelector(({ eere }) => eere.inputs.constantMwh);
  const annualGwh = useTypedSelector(({ eere }) => eere.inputs.annualGwh);
  const broadProgram = useTypedSelector(({ eere }) => eere.inputs.broadProgram);
  const reduction = useTypedSelector(({ eere }) => eere.inputs.reduction);
  const topHours = useTypedSelector(({ eere }) => eere.inputs.topHours);
  const onshoreWind = useTypedSelector(({ eere }) => eere.inputs.onshoreWind);
  const offshoreWind = useTypedSelector(({ eere }) => eere.inputs.offshoreWind);
  const utilitySolar = useTypedSelector(({ eere }) => eere.inputs.utilitySolar);
  const rooftopSolar = useTypedSelector(({ eere }) => eere.inputs.rooftopSolar);

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  const atLeastOneRegionSupportsOffshoreWind =
    geographicFocus === 'regions'
      ? selectedRegion?.offshoreWind
      : selectedStateRegions.some((region) => region.offshoreWind);

  const inputsAreValid = errors.length === 0;

  // text input values from fields
  const inputsFields = [
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
  ];

  const inputsAreEmpty =
    inputsFields.filter((field) => field?.length > 0).length === 0;

  const calculationDisabled =
    !inputsAreValid || inputsAreEmpty || status === 'started';

  const disabledClass = calculationDisabled ? ' avert-button-disabled' : '';

  const eereButtonOptions = {
    ready: 'Calculate EE/RE Impacts',
    started: 'Calculating...',
    complete: 'Recalculate EE/RE Impacts',
  };

  return (
    <>
      <div css={inputsBlockStyles} data-avert-eere-inputs>
        <header css={inputsCategoryStyles}>
          <p>Energy Efficiency</p>
        </header>

        <details css={inputsGroupStyles}>
          <summary css={inputsLabelStyles} data-label="A">
            Reductions spread evenly throughout the year
          </summary>

          <section css={inputsContentStyles}>
            <p>
              <strong>Choose one:</strong>
            </p>

            <ul>
              <li>
                <EEREInputField
                  label="Reduce total annual generation by:"
                  ariaLabel="Number of GWh expected to be saved in a single year"
                  suffix="GWh"
                  value={annualGwh}
                  fieldName="annualGwh"
                  disabled={constantMwh}
                  onChange={(text) => dispatch(updateEereAnnualGwh(text))}
                  tooltip={
                    <>
                      Enter the total number of GWh expected to be saved in a
                      single year. This option simply distributes the total
                      annual savings evenly over all hours of the year. An
                      industrial or refrigeration efficiency program may be well
                      represented by a constant reduction across most hours of
                      the year.
                    </>
                  }
                />
              </li>

              <li>
                <EEREInputField
                  label="Reduce hourly generation by:"
                  ariaLabel="Constant reduction for every hour of the year, in MW"
                  suffix="MW"
                  value={constantMwh}
                  fieldName="constantMwh"
                  disabled={annualGwh}
                  onChange={(text) => dispatch(updateEereConstantMw(text))}
                  tooltip={
                    <>
                      “Reduce hourly generation” is identical in effect to
                      reducing total annual generation. It allows you to enter a
                      constant reduction for every hour of the year, in MW. An
                      industrial or refrigeration efficiency program may be well
                      represented by a constant reduction across most hours of
                      the year.
                    </>
                  }
                />
              </li>
            </ul>
          </section>
        </details>

        <details css={inputsGroupStyles}>
          <summary css={inputsLabelStyles} data-label="B">
            Percentage reductions in some or all hours
          </summary>

          <section css={inputsContentStyles}>
            <p>
              <strong>Choose one:</strong>
            </p>

            <ul>
              <li>
                <EEREInputField
                  label="Broad-based program: Reduce generation by:"
                  ariaLabel="Load reduction percentage applied to all hours of the year"
                  suffix="% in all hours"
                  value={broadProgram}
                  fieldName="broadProgram"
                  disabled={reduction || topHours}
                  onChange={(text) =>
                    dispatch(updateEereBroadBasedProgram(text))
                  }
                  tooltip={
                    <>
                      To simulate a broad-based efficiency program, enter an
                      estimated load reduction fraction. This percentage
                      reduction will be applied to all hours of the year.
                    </>
                  }
                />
              </li>

              <li>
                <EEREInputField
                  label="Targeted program: Reduce generation by:"
                  ariaLabel="Load reduction (as a fraction of peaking load) that would be targeted"
                  suffix="% during the peak:"
                  value={reduction}
                  fieldName="reduction"
                  disabled={broadProgram}
                  onChange={(text) => dispatch(updateEereReduction(text))}
                />

                <EEREInputField
                  ariaLabel="Fraction of high-demand hours that the program is expected to affect"
                  suffix="% of hours"
                  value={topHours}
                  fieldName="topHours"
                  disabled={broadProgram}
                  onChange={(text) => dispatch(updateEereTopHours(text))}
                  tooltip={
                    <>
                      To simulate a peak-reduction targeting program such as
                      demand response, enter the load reduction (as a fraction
                      of peaking load) that would be targeted, as well as the
                      fraction of high-demand hours that the program is expected
                      to affect (e.g., 1%–3%).
                    </>
                  }
                />
              </li>
            </ul>
          </section>
        </details>

        <header css={inputsCategoryStyles}>
          <p>Renewable Energy</p>
        </header>

        <details css={inputsGroupStyles}>
          <summary css={inputsLabelStyles} data-label="C">
            Wind
          </summary>

          <section css={inputsContentStyles}>
            <p>
              <strong>Choose one or both:</strong>
            </p>

            <ul>
              <li>
                <EEREInputField
                  label="Onshore wind total capacity:"
                  ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                  suffix="MW"
                  value={onshoreWind}
                  fieldName="onshoreWind"
                  onChange={(text) => dispatch(updateEereOnshoreWind(text))}
                  tooltip={
                    <>
                      Enter the total capacity (maximum potential electricity
                      generation) for this type of resource, measured in MW. The
                      model uses these inputs along with hourly capacity factors
                      that vary by resource type and region.
                    </>
                  }
                />
              </li>

              <li>
                {atLeastOneRegionSupportsOffshoreWind ? (
                  <EEREInputField
                    label="Offshore wind total capacity:"
                    ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                    suffix="MW"
                    value={offshoreWind}
                    fieldName="offshoreWind"
                    onChange={(text) => dispatch(updateEereOffshoreWind(text))}
                    tooltip={
                      <>
                        Enter the total capacity (maximum potential electricity
                        generation) for this type of resource, measured in MW.
                        The model uses these inputs along with hourly capacity
                        factors that vary by resource type and region.
                      </>
                    }
                  />
                ) : geographicFocus === 'regions' ? (
                  <span css={inputLabelStyles}>
                    <em>
                      Offshore wind calculations are not available in this AVERT
                      region{' '}
                    </em>

                    <Tooltip id="no-offshoreWind-region">
                      AVERT does not support offshore wind modeling in this
                      region. It is unlikely that offshore areas suitable for
                      wind farms would connect to the electrical grid in this
                      region.
                    </Tooltip>
                  </span>
                ) : (
                  <span css={inputLabelStyles}>
                    <em>
                      Offshore wind calculations are not available in the AVERT
                      region(s) that this state is part of{' '}
                    </em>

                    <Tooltip id="no-offshoreWind-state">
                      AVERT does not support offshore wind modeling in the
                      region(s) that this state is part of. It is unlikely that
                      offshore areas suitable for wind farms would connect to
                      the electrical grid in these regions.
                    </Tooltip>
                  </span>
                )}
              </li>
            </ul>
          </section>
        </details>

        <details css={inputsGroupStyles}>
          <summary css={inputsLabelStyles} data-label="D">
            Solar photovoltaic
          </summary>

          <section css={inputsContentStyles}>
            <p>
              <strong>Choose one or both:</strong>
            </p>

            <ul>
              <li>
                <EEREInputField
                  label="Utility-scale solar photovoltaic total capacity:"
                  ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                  suffix="MW"
                  value={utilitySolar}
                  fieldName="utilitySolar"
                  onChange={(text) => dispatch(updateEereUtilitySolar(text))}
                  tooltip={
                    <>
                      Enter the total capacity (maximum potential electricity
                      generation) for this type of resource, measured in MW. The
                      model uses these inputs along with hourly capacity factors
                      that vary by resource type and region.
                    </>
                  }
                />
              </li>

              <li>
                <EEREInputField
                  label="Distributed (rooftop) solar photovoltaic total capacity:"
                  ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                  suffix="MW"
                  value={rooftopSolar}
                  fieldName="rooftopSolar"
                  onChange={(text) => dispatch(updateEereRooftopSolar(text))}
                  tooltip={
                    <>
                      Enter the total capacity (maximum potential electricity
                      generation) for this type of resource, measured in MW. The
                      model uses these inputs along with hourly capacity factors
                      that vary by resource type and region.
                    </>
                  }
                />
              </li>
            </ul>
          </section>
        </details>
      </div>

      <p css={impactsButtonStyles}>
        <a
          className={`avert-button${disabledClass}`}
          href="/"
          onClick={(ev) => {
            ev.preventDefault();
            if (calculationDisabled) return;
            dispatch(calculateEereProfile());
          }}
          data-avert-calculate-impacts-btn
        >
          {eereButtonOptions[status]}
        </a>
      </p>
    </>
  );
}

export default EEREInputs;
