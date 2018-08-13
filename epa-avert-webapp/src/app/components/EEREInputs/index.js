// @flow

import React from 'react';
// components
import EEREInputField from 'app/components/EEREInputField/container.js';
import Tooltip from 'app/components/Tooltip/container.js';
// styles
import './styles.css';

type Props = {
  // redux connected props
  status: string,
  valid: boolean,
  errors: Array<string>,
  constantMwh: string,
  annualGwh: string,
  broadProgram: string,
  reduction: string,
  topHours: string,
  windCapacity: string,
  utilitySolar: string,
  rooftopSolar: string,
  limits: {
    annualGwh: boolean | number,
    constantMwh: boolean | number,
    renewables: boolean | number,
    percent: boolean | number,
  },
  onConstantMwChange: (string) => void,
  onAnnualGwhChange: (string) => void,
  onBroadBasedProgramChange: (string) => void,
  onReductionChange: (string) => void,
  onTopHoursChange: (string) => void,
  onWindCapacityChange: (string) => void,
  onUtilitySolarChange: (string) => void,
  onRooftopSolarChange: (string) => void,
  onCalculateProfile: () => void,
};

const EEREInputs = (props: Props) => {
  const {
    status,
    valid,
    errors,
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    windCapacity,
    utilitySolar,
    rooftopSolar,
    limits,
    onConstantMwChange,
    onAnnualGwhChange,
    onBroadBasedProgramChange,
    onReductionChange,
    onTopHoursChange,
    onWindCapacityChange,
    onUtilitySolarChange,
    onRooftopSolarChange,
    onCalculateProfile,
  } = props;

  const displayError = (input) => {
    if (errors.indexOf(input.name) !== -1 && input.value.length > 0) {
      let Message;
      if (Number(input.value) >= 0) {
        Message = (
          <span className="avert-input-error">
            <span className="avert-input-error-range">
              Please enter a number between 0 and {input.max}.
            </span>
            This will help ensure that each of your proposed programs displaces
            no more than approximately 30% of regional fossil generation in any
            given hour. After you enter all your inputs and calculate your
            hourly EE/RE profile below, AVERT will check more precisely to
            ensure that your combined inputs are within AVERT’s recommended
            limits.
          </span>
        );
      } else {
        Message = (
          <span className="avert-input-error">
            <span className="avert-input-error-range">
              Please enter a positive number.
            </span>
            If you wish to model a reverse EE/RE scenario (i.e., a negative
            number), use the Excel version of the AVERT Main Module.
          </span>
        );
      }

      return Message;
    }
  };

  // text input values from fields
  const inputs = [
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    windCapacity,
    utilitySolar,
    rooftopSolar,
  ];
  // prettier-ignore
  const inputsAreEmpty = inputs.filter((field) => field.length > 0).length === 0;

  // prettier-ignore
  const disabledClass = (!valid || inputsAreEmpty || status === 'started')
    ? ' avert-button-disabled'
    : '';

  const eereButtonOptions = {
    ready: 'Calculate EE/RE Impacts',
    started: 'Calculating...',
    complete: 'Recalculate EE/RE Impacts',
  };

  return (
    <div>
      <div className="avert-details-block">
        <header>
          <p>Energy Efficiency</p>
        </header>

        <details>
          <summary data-label="A">
            Reductions spread evenly throughout the year
          </summary>
          <section>
            <p>
              <strong>Choose one:</strong>
            </p>
            <ul>
              <li>
                <span className="avert-input-label">
                  Reduce total annual generation by{' '}
                </span>
                <EEREInputField
                  value={annualGwh}
                  disabled={constantMwh ? true : false}
                  onChange={onAnnualGwhChange}
                />
                <span className="avert-input-unit"> GWh </span>

                <Tooltip id={1}>
                  Enter the total number of GWh expected to be saved in a single
                  year. This option simply distributes the total annual savings
                  evenly over all hours of the year. An industrial or
                  refrigeration efficiency program may be well represented by a
                  constant reduction across most hours of the year.
                </Tooltip>

                {displayError({
                  name: 'annualGwh',
                  value: annualGwh,
                  max: limits.annualGwh,
                })}
              </li>

              <li>
                <span className="avert-input-label">
                  Reduce hourly generation by{' '}
                </span>
                <EEREInputField
                  value={constantMwh}
                  disabled={annualGwh ? true : false}
                  onChange={onConstantMwChange}
                />
                <span className="avert-input-unit"> MW </span>

                <Tooltip id={2}>
                  “Reduce hourly generation” is identical in effect to reducing
                  total annual generation. It allows you to enter a constant
                  reduction for every hour of the year, in MW. An industrial or
                  refrigeration efficiency program may be well represented by a
                  constant reduction across most hours of the year.
                </Tooltip>

                {displayError({
                  name: 'constantMwh',
                  value: constantMwh,
                  max: limits.constantMwh,
                })}
              </li>
            </ul>
          </section>
        </details>

        <details>
          <summary data-label="B">
            Percentage reductions in some or all hours
          </summary>
          <section>
            <p>
              <strong>Choose one:</strong>
            </p>
            <ul>
              <li>
                <span className="avert-input-label">
                  Broad-based program: Reduce generation by{' '}
                </span>
                <EEREInputField
                  value={broadProgram}
                  disabled={reduction || topHours ? true : false}
                  onChange={onBroadBasedProgramChange}
                />
                <span className="avert-input-unit"> % in all hours </span>

                <Tooltip id={3}>
                  To simulate a broad-based efficiency program, enter an
                  estimated load reduction fraction. This percentage reduction
                  will be applied to all hours of the year.
                </Tooltip>

                {displayError({
                  name: 'reduction',
                  value: broadProgram,
                  max: limits.percent,
                })}
              </li>

              <li>
                <span className="avert-input-label">
                  Targeted program: Reduce generation by{' '}
                </span>
                <EEREInputField
                  value={reduction}
                  disabled={broadProgram ? true : false}
                  onChange={onReductionChange}
                />
                <span className="avert-input-unit"> % during the peak </span>
                <EEREInputField
                  value={topHours}
                  disabled={broadProgram ? true : false}
                  onChange={onTopHoursChange}
                />
                <span className="avert-input-unit"> % of hours </span>

                <Tooltip id={4}>
                  To simulate a peak-reduction targeting program such as demand
                  response, enter the load reduction (as a fraction of peaking
                  load) that would be targeted, as well as the fraction of
                  high-demand hours that the program is expected to affect
                  (e.g., 1%–3%).
                </Tooltip>

                {displayError({
                  name: 'reduction',
                  value: reduction,
                  max: limits.percent,
                })}

                {displayError({
                  name: 'topHours',
                  value: topHours,
                  max: 100,
                })}
              </li>
            </ul>
          </section>
        </details>

        <header>
          <p>Renewable Energy</p>
        </header>

        <details>
          <summary data-label="C">Wind</summary>
          <section>
            <p>
              <span className="avert-input-label">Total capacity: </span>
              <EEREInputField
                value={windCapacity}
                onChange={onWindCapacityChange}
              />
              <span className="avert-input-unit"> MW </span>

              <Tooltip id={5}>
                Enter the total capacity (maximum potential electricity
                generation) for this type of resource, measured in MW. The model
                uses these inputs along with hourly capacity factors that vary
                by resource type and region.
              </Tooltip>

              {displayError({
                name: 'windCapacity',
                value: windCapacity,
                max: limits.renewables,
              })}
            </p>
          </section>
        </details>

        <details>
          <summary data-label="D">Utility-scale solar photovoltaic</summary>
          <section>
            <p>
              <span className="avert-input-label">Total capacity: </span>
              <EEREInputField
                value={utilitySolar}
                onChange={onUtilitySolarChange}
              />
              <span className="avert-input-unit"> MW </span>

              <Tooltip id={6}>
                Enter the total capacity (maximum potential electricity
                generation) for this type of resource, measured in MW. The model
                uses these inputs along with hourly capacity factors that vary
                by resource type and region.
              </Tooltip>

              {displayError({
                name: 'utilitySolar',
                value: utilitySolar,
                max: limits.renewables,
              })}
            </p>
          </section>
        </details>

        <details>
          <summary data-label="E">
            Distributed (rooftop) solar photovoltaic
          </summary>
          <section>
            <p>
              <span className="avert-input-label">Total capacity: </span>
              <EEREInputField
                value={rooftopSolar}
                onChange={onRooftopSolarChange}
              />
              <span className="avert-input-unit"> MW </span>

              <Tooltip id={7}>
                Enter the total capacity (maximum potential electricity
                generation) for this type of resource, measured in MW. The model
                uses these inputs along with hourly capacity factors that vary
                by resource type and region.
              </Tooltip>

              {displayError({
                name: 'rooftopSolar',
                value: rooftopSolar,
                max: limits.renewables,
              })}
            </p>
          </section>
        </details>
      </div>

      <p className="avert-impacts-button">
        <a
          className={`avert-button${disabledClass}`}
          href=""
          onClick={(event) => {
            event.preventDefault();
            // if valid prop (state) is true, calculate profile
            valid && onCalculateProfile();
          }}
        >
          {eereButtonOptions[status]}
        </a>
      </p>
    </div>
  );
};

export default EEREInputs;
