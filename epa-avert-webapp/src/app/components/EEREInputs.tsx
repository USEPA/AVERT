/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
import { useDispatch } from 'react-redux';
// components
import EEREInputField from 'app/components/EEREInputField';
import Tooltip from 'app/components/Tooltip';
// reducers
import { useTypedSelector } from 'app/redux/index';
import {
  EereInputFields,
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
import {
  useSelectedRegion,
  useSelectedState,
  useSelectedStateRegions,
} from 'app/hooks';

const inputsBlockStyles = css`
  margin: 1rem 0;
  border-top: 1px solid #ccc;

  p,
  ul,
  li {
    margin-top: 0 !important;
    font-size: 0.625rem;
  }

  @media (min-width: 25em) {
    p,
    ul,
    li {
      font-size: 0.6875rem;
    }
  }

  @media (min-width: 30em) {
    p,
    ul,
    li {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 35em) {
    p,
    ul,
    li {
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 40em) {
    p,
    ul,
    li {
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
    background-color: rgb(0, 169, 204);
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
    background-color: rgb(0, 169, 204);
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

const inputUnitStyles = css`
  font-size: 0.5rem;

  @media (min-width: 25em) {
    font-size: 0.5625rem;
  }

  @media (min-width: 30em) {
    font-size: 0.625rem;
  }

  @media (min-width: 35em) {
    font-size: 0.6875rem;
  }

  @media (min-width: 40em) {
    font-size: 0.75rem;
  }
`;

export const inputErrorStyles = css`
  display: block;
  font-style: italic;
  color: rgb(206, 29, 29);
`;

const errorRangeStyles = css`
  display: block;
  font-weight: bold;
  font-style: normal;
`;

const impactsButtonStyles = css`
  text-align: center;
  margin-bottom: 1rem;
`;

function displayError({
  errors,
  fieldName,
  inputValue,
  maxValue,
}: {
  errors: EereInputFields[];
  fieldName: EereInputFields;
  inputValue: string;
  maxValue: number;
}) {
  if (inputValue?.length <= 0) return;
  if (!errors?.includes(fieldName)) return;

  return Number(inputValue) >= 0 ? (
    <span css={inputErrorStyles}>
      <span css={errorRangeStyles}>
        Please enter a number between 0 and {maxValue}.
      </span>
      This will help ensure that each of your proposed programs displaces no
      more than approximately 30% of regional fossil generation in any given
      hour. After you enter all your inputs and calculate your hourly EE/RE
      profile below, AVERT will check more precisely to ensure that your
      combined inputs are within AVERT’s recommended limits.
    </span>
  ) : (
    <span css={inputErrorStyles}>
      <span css={errorRangeStyles}>Please enter a positive number.</span>
      If you wish to model a reverse EE/RE scenario (i.e., a negative number),
      use the Excel version of the AVERT Main Module.
    </span>
  );
}

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
  const selectedState = useSelectedState();
  const selectedStateRegions = useSelectedStateRegions();

  const fallbackEereLimits = {
    annualGwh: 0,
    constantMwh: 0,
    renewables: 0,
    percent: 0,
  };

  const limits =
    geographicFocus === 'regions'
      ? selectedRegion?.eereLimits || fallbackEereLimits
      : selectedState?.eereLimits || fallbackEereLimits;

  const regionSupportsOffshoreWind =
    geographicFocus === 'regions'
      ? selectedRegion?.offshoreWind
      : selectedStateRegions.every((region) => region.offshoreWind);

  const inputsAreValid = errors.length === 0;

  // text input values from fields
  const inputsFields = [
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    onshoreWind,
    utilitySolar,
    rooftopSolar,
  ];

  const inputsAreEmpty =
    inputsFields.filter((field) => field?.length > 0).length === 0;

  const disabledClass =
    !inputsAreValid || inputsAreEmpty || status === 'started'
      ? ' avert-button-disabled'
      : '';

  const eereButtonOptions = {
    ready: 'Calculate EE/RE Impacts',
    started: 'Calculating...',
    complete: 'Recalculate EE/RE Impacts',
  };

  return (
    <React.Fragment>
      <div css={inputsBlockStyles}>
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
                <span css={inputLabelStyles}>
                  Reduce total annual generation by{' '}
                </span>
                <EEREInputField
                  value={annualGwh}
                  disabled={constantMwh}
                  onChange={(text) => {
                    dispatch(updateEereAnnualGwh(text, limits.annualGwh));
                  }}
                />
                <span css={inputUnitStyles}> GWh </span>

                <Tooltip id={1}>
                  Enter the total number of GWh expected to be saved in a single
                  year. This option simply distributes the total annual savings
                  evenly over all hours of the year. An industrial or
                  refrigeration efficiency program may be well represented by a
                  constant reduction across most hours of the year.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'annualGwh',
                  inputValue: annualGwh,
                  maxValue: limits.annualGwh,
                })}
              </li>

              <li>
                <span css={inputLabelStyles}>Reduce hourly generation by </span>
                <EEREInputField
                  value={constantMwh}
                  disabled={annualGwh}
                  onChange={(text) => {
                    dispatch(updateEereConstantMw(text, limits.constantMwh));
                  }}
                />
                <span css={inputUnitStyles}> MW </span>

                <Tooltip id={2}>
                  “Reduce hourly generation” is identical in effect to reducing
                  total annual generation. It allows you to enter a constant
                  reduction for every hour of the year, in MW. An industrial or
                  refrigeration efficiency program may be well represented by a
                  constant reduction across most hours of the year.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'constantMwh',
                  inputValue: constantMwh,
                  maxValue: limits.constantMwh,
                })}
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
                <span css={inputLabelStyles}>
                  Broad-based program: Reduce generation by{' '}
                </span>
                <EEREInputField
                  value={broadProgram}
                  disabled={reduction || topHours}
                  onChange={(text) => {
                    dispatch(updateEereBroadBasedProgram(text, limits.percent));
                  }}
                />
                <span css={inputUnitStyles}> % in all hours </span>

                <Tooltip id={3}>
                  To simulate a broad-based efficiency program, enter an
                  estimated load reduction fraction. This percentage reduction
                  will be applied to all hours of the year.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'reduction',
                  inputValue: broadProgram,
                  maxValue: limits.percent,
                })}
              </li>

              <li>
                <span css={inputLabelStyles}>
                  Targeted program: Reduce generation by{' '}
                </span>
                <EEREInputField
                  value={reduction}
                  disabled={broadProgram}
                  onChange={(text) => {
                    dispatch(updateEereReduction(text, limits.percent));
                  }}
                />
                <span css={inputUnitStyles}> % during the peak </span>
                <EEREInputField
                  value={topHours}
                  disabled={broadProgram}
                  onChange={(text) => {
                    dispatch(updateEereTopHours(text, 100));
                  }}
                />
                <span css={inputUnitStyles}> % of hours </span>

                <Tooltip id={4}>
                  To simulate a peak-reduction targeting program such as demand
                  response, enter the load reduction (as a fraction of peaking
                  load) that would be targeted, as well as the fraction of
                  high-demand hours that the program is expected to affect
                  (e.g., 1%–3%).
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'reduction',
                  inputValue: reduction,
                  maxValue: limits.percent,
                })}

                {displayError({
                  errors,
                  fieldName: 'topHours',
                  inputValue: topHours,
                  maxValue: 100,
                })}
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
                <span css={inputLabelStyles}>
                  Onshore wind total capacity:{' '}
                </span>
                <EEREInputField
                  value={onshoreWind}
                  onChange={(text) => {
                    dispatch(updateEereOnshoreWind(text, limits.renewables));
                  }}
                />
                <span css={inputUnitStyles}> MW </span>

                <Tooltip id={5}>
                  Enter the total capacity (maximum potential electricity
                  generation) for this type of resource, measured in MW. The
                  model uses these inputs along with hourly capacity factors
                  that vary by resource type and region.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'onshoreWind',
                  inputValue: onshoreWind,
                  maxValue: limits.renewables,
                })}
              </li>

              <li>
                {regionSupportsOffshoreWind ? (
                  <React.Fragment>
                    <span css={inputLabelStyles}>
                      Offshore wind total capacity:{' '}
                    </span>

                    <EEREInputField
                      value={offshoreWind}
                      onChange={(text) => {
                        dispatch(
                          updateEereOffshoreWind(text, limits.renewables),
                        );
                      }}
                    />
                    <span css={inputUnitStyles}> MW </span>

                    <Tooltip id={6}>
                      Enter the total capacity (maximum potential electricity
                      generation) for this type of resource, measured in MW. The
                      model uses these inputs along with hourly capacity factors
                      that vary by resource type and region.
                    </Tooltip>

                    {displayError({
                      errors,
                      fieldName: 'offshoreWind',
                      inputValue: offshoreWind,
                      maxValue: limits.renewables,
                    })}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span css={inputLabelStyles}>
                      <em>
                        Offshore wind is not available in this AVERT region.{' '}
                      </em>
                    </span>

                    <Tooltip id={7}>
                      AVERT does not support offshore wind modeling in this
                      region. It is unlikely that offshore areas suitable for
                      wind farms would connect to the electrical grid in this
                      region.
                    </Tooltip>
                  </React.Fragment>
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
                <span css={inputLabelStyles}>
                  Utility-scale solar photovoltaic total capacity:{' '}
                </span>
                <EEREInputField
                  value={utilitySolar}
                  onChange={(text) => {
                    dispatch(updateEereUtilitySolar(text, limits.renewables));
                  }}
                />
                <span css={inputUnitStyles}> MW </span>

                <Tooltip id={8}>
                  Enter the total capacity (maximum potential electricity
                  generation) for this type of resource, measured in MW. The
                  model uses these inputs along with hourly capacity factors
                  that vary by resource type and region.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'utilitySolar',
                  inputValue: utilitySolar,
                  maxValue: limits.renewables,
                })}
              </li>

              <li>
                <span css={inputLabelStyles}>
                  Distributed (rooftop) solar voltaic total capacity:{' '}
                </span>
                <EEREInputField
                  value={rooftopSolar}
                  onChange={(text) => {
                    dispatch(updateEereRooftopSolar(text, limits.renewables));
                  }}
                />
                <span css={inputUnitStyles}> MW </span>

                <Tooltip id={9}>
                  Enter the total capacity (maximum potential electricity
                  generation) for this type of resource, measured in MW. The
                  model uses these inputs along with hourly capacity factors
                  that vary by resource type and region.
                </Tooltip>

                {displayError({
                  errors,
                  fieldName: 'rooftopSolar',
                  inputValue: rooftopSolar,
                  maxValue: limits.renewables,
                })}
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
            // if inputsAreValid, calculate profile
            inputsAreValid && dispatch(calculateEereProfile());
          }}
        >
          {eereButtonOptions[status]}
        </a>
      </p>
    </React.Fragment>
  );
}

export default EEREInputs;
