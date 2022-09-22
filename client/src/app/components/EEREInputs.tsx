/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// components
import { EERETextInput } from 'app/components/EERETextInput';
import { EERESelectInput } from 'app/components/EERESelectInput';
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
  updateEereBatteryEVs,
  updateEereBatteryEVsProfile,
  updateEereHybridEVs,
  updateEereHybridEVsProfile,
  updateEereTransitBuses,
  updateEereTransitBusesProfile,
  updateEereSchoolBuses,
  updateEereSchoolBusesProfile,
  updateEereEVDeploymentLocation,
  updateEereEVModelYear,
  updateEereICEVehicleReplaced,
  calculateEereProfile,
} from 'app/redux/reducers/eere';
// hooks
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

const inputsBlockStyles = css`
  margin: 1rem 0;
  border-top: 1px solid #ccc;

  & ul {
    padding-left: 1.5rem !important;
  }

  & :is(p, ul) {
    margin-top: 0 !important;
  }

  & :is(label, input, select, p, li) {
    font-size: 0.625rem;
  }

  @media (min-width: 25em) {
    & :is(label, input, select, p, li) {
      font-size: 0.6875rem;
    }
  }

  @media (min-width: 30em) {
    & :is(label, input, select, p, li) {
      font-size: 0.75rem;
    }
  }

  @media (min-width: 35em) {
    & :is(label, input, select, p, li) {
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 40em) {
    & :is(label, input, select, p, li) {
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
  /* (summary is styled with inputsSummaryStyles) */
  &[open] > summary::after {
    background-color: rgb(0, 164, 200);
  }
`;

const inputsSummaryStyles = css`
  display: block; /* IE */
  padding: 1rem 0.625rem;
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

  /* letter (A, B, C, D, E, F, G, or H) */
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

const inputsSectionStyles = css`
  padding: 0 1rem 0.75rem;

  hr {
    margin: 0.75rem 0;
    border: none;
    border-top: 1px solid #ccc;
  }
`;

const inputTextStyles = css`
  display: block;

  @media (min-width: 35em) {
    display: inline;
  }
`;

const evInputsStyles = css`
  display: grid;
  grid-template-columns: max-content 1fr 1fr;
  grid-gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;

  label {
    text-align: right;
  }

  input[type='text'] {
    margin: 0;
    width: 100%;
  }

  select {
    margin: 0;
  }

  [data-input-error] {
    grid-column: 1 / -1;
    grid-row-start: 6; /* NOTE: bumps the error below the header row + four rows of inputs */
  }
`;

const impactsButtonStyles = css`
  text-align: center;
  margin-bottom: 1rem;
`;

// TODO: store profiles in a config file
const evChargingProfiles = [
  { id: 'fleetwide', name: 'Fleetwide' },
  { id: 'residentialLevel1', name: 'Residential Level 1' },
  { id: 'residentialLevel2', name: 'Residential Level 2' },
  { id: 'workLevel1', name: 'Work Level 1' },
  { id: 'workLevel2', name: 'Work Level 2' },
  { id: 'dcFastCharging', name: 'DC Fast Charging' },
];

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
  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const batteryEVsProfile = useTypedSelector(
    ({ eere }) => eere.inputs.batteryEVsProfile,
  );
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const hybridEVsProfile = useTypedSelector(
    ({ eere }) => eere.inputs.hybridEVsProfile,
  );
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const transitBusesProfile = useTypedSelector(
    ({ eere }) => eere.inputs.transitBusesProfile,
  );
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);
  const schoolBusesProfile = useTypedSelector(
    ({ eere }) => eere.inputs.schoolBusesProfile,
  );
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );
  const evModelYear = useTypedSelector(({ eere }) => eere.inputs.evModelYear);
  const iceVehicleReplaced = useTypedSelector(
    ({ eere }) => eere.inputs.iceVehicleReplaced,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  const atLeastOneRegionSupportsOffshoreWind =
    geographicFocus === 'regions'
      ? selectedRegion?.offshoreWind
      : selectedStateRegions.some((region) => region.offshoreWind);

  const textInputsAreValid = errors.length === 0;

  // text input values from fields
  const textInputsFields = [
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
  ];

  const textInputsAreEmpty =
    textInputsFields.filter((field) => field?.length > 0).length === 0;

  const calculationDisabled =
    !textInputsAreValid || textInputsAreEmpty || status === 'started';

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
          <summary css={inputsSummaryStyles} data-label="A">
            Reductions spread evenly throughout the year
          </summary>

          <section css={inputsSectionStyles}>
            <p>
              <strong>Choose one:</strong>
            </p>

            <ul>
              <li>
                <EERETextInput
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
                <EERETextInput
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
          <summary css={inputsSummaryStyles} data-label="B">
            Percentage reductions in some or all hours
          </summary>

          <section css={inputsSectionStyles}>
            <p>
              <strong>Choose one:</strong>
            </p>

            <ul>
              <li>
                <EERETextInput
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
                <EERETextInput
                  label="Targeted program: Reduce generation by:"
                  ariaLabel="Load reduction (as a fraction of peaking load) that would be targeted"
                  suffix="% during the peak:"
                  value={reduction}
                  fieldName="reduction"
                  disabled={broadProgram}
                  onChange={(text) => dispatch(updateEereReduction(text))}
                />

                <EERETextInput
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
          <summary css={inputsSummaryStyles} data-label="C">
            Wind
          </summary>

          <section css={inputsSectionStyles}>
            <p>
              <EERETextInput
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
            </p>

            <p>
              {atLeastOneRegionSupportsOffshoreWind ? (
                <EERETextInput
                  label="Offshore wind total capacity:"
                  ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                  suffix="MW"
                  value={offshoreWind}
                  fieldName="offshoreWind"
                  onChange={(text) => dispatch(updateEereOffshoreWind(text))}
                  tooltip={
                    <>
                      Enter the total capacity (maximum potential electricity
                      generation) for this type of resource, measured in MW. The
                      model uses these inputs along with hourly capacity factors
                      that vary by resource type and region.
                    </>
                  }
                />
              ) : geographicFocus === 'regions' ? (
                <span css={inputTextStyles}>
                  <em>
                    Offshore wind calculations are not available in this AVERT
                    region{' '}
                  </em>

                  <Tooltip id="no-offshoreWind-region">
                    AVERT does not support offshore wind modeling in this
                    region. It is unlikely that offshore areas suitable for wind
                    farms would connect to the electrical grid in this region.
                  </Tooltip>
                </span>
              ) : (
                <span css={inputTextStyles}>
                  <em>
                    Offshore wind calculations are not available in the AVERT
                    region(s) that this state is part of{' '}
                  </em>

                  <Tooltip id="no-offshoreWind-state">
                    AVERT does not support offshore wind modeling in the
                    region(s) that this state is part of. It is unlikely that
                    offshore areas suitable for wind farms would connect to the
                    electrical grid in these regions.
                  </Tooltip>
                </span>
              )}
            </p>
          </section>
        </details>

        <details css={inputsGroupStyles}>
          <summary css={inputsSummaryStyles} data-label="D">
            Solar photovoltaic
          </summary>

          <section css={inputsSectionStyles}>
            <p>
              <EERETextInput
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
            </p>

            <p>
              <EERETextInput
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
            </p>
          </section>
        </details>

        <header css={inputsCategoryStyles}>
          <p>Electric Vehicles</p>
        </header>

        <details css={inputsGroupStyles}>
          <summary css={inputsSummaryStyles} data-label="E">
            Electric Vehicles
          </summary>

          <section css={inputsSectionStyles}>
            <div css={evInputsStyles}>
              <p>&nbsp;</p>
              <p>
                <strong>Number of Vehicles</strong>
              </p>
              <p>
                <strong>Charging Profile</strong>
              </p>

              <EERETextInput
                label="Light-duty battery EVs:"
                ariaLabel="TODO"
                value={batteryEVs}
                fieldName="batteryEVs"
                onChange={(text) => dispatch(updateEereBatteryEVs(text))}
              />

              <EERESelectInput
                ariaLabel="TODO"
                options={evChargingProfiles}
                value={batteryEVsProfile}
                fieldName="batteryEVsProfile"
                disabled={!batteryEVs}
                onChange={(option) =>
                  dispatch(updateEereBatteryEVsProfile(option))
                }
              />

              <EERETextInput
                label="Light-duty plug-in hybrid EVs:"
                ariaLabel="TODO"
                value={hybridEVs}
                fieldName="hybridEVs"
                onChange={(text) => dispatch(updateEereHybridEVs(text))}
              />

              <EERESelectInput
                ariaLabel="TODO"
                options={evChargingProfiles}
                value={hybridEVsProfile}
                fieldName="hybridEVsProfile"
                disabled={!hybridEVs}
                onChange={(option) =>
                  dispatch(updateEereHybridEVsProfile(option))
                }
              />

              <EERETextInput
                label="Electric transit buses:"
                ariaLabel="TODO"
                value={transitBuses}
                fieldName="transitBuses"
                onChange={(text) => dispatch(updateEereTransitBuses(text))}
              />

              <EERESelectInput
                ariaLabel="TODO"
                options={evChargingProfiles}
                value={transitBusesProfile}
                fieldName="transitBusesProfile"
                disabled={!transitBuses}
                onChange={(option) =>
                  dispatch(updateEereTransitBusesProfile(option))
                }
              />

              <EERETextInput
                label="Electric school buses:"
                ariaLabel="TODO"
                value={schoolBuses}
                fieldName="schoolBuses"
                onChange={(text) => dispatch(updateEereSchoolBuses(text))}
              />

              <EERESelectInput
                ariaLabel="TODO"
                options={evChargingProfiles}
                value={schoolBusesProfile}
                fieldName="schoolBusesProfile"
                disabled={!schoolBuses}
                onChange={(option) =>
                  dispatch(updateEereSchoolBusesProfile(option))
                }
              />
            </div>

            <hr />

            <p>
              <label htmlFor="evDeploymentLocation">
                Location of EV deployment:
              </label>

              <EERESelectInput
                ariaLabel="TODO"
                options={[{ id: '', name: 'TODO' }]}
                value={evDeploymentLocation}
                fieldName="evDeploymentLocation"
                onChange={(option) =>
                  dispatch(updateEereEVDeploymentLocation(option))
                }
              />

              <Tooltip id="evDeploymentLocation">
                <>TODO</>
              </Tooltip>
            </p>

            <hr />

            <p>
              <label htmlFor="evModelYear">EV model year:</label>

              <EERESelectInput
                ariaLabel="TODO"
                options={[{ id: '', name: 'TODO' }]}
                value={evModelYear}
                fieldName="evModelYear"
                onChange={(option) => dispatch(updateEereEVModelYear(option))}
              />

              <Tooltip id="evModelYear">
                <>TODO</>
              </Tooltip>
            </p>

            <p>
              <label htmlFor="iceVehicleReplaced">
                Internal combustion engine vehicle being replaced:
              </label>

              <EERESelectInput
                ariaLabel="TODO"
                options={[{ id: '', name: 'TODO' }]}
                value={iceVehicleReplaced}
                fieldName="iceVehicleReplaced"
                onChange={(option) =>
                  dispatch(updateEereICEVehicleReplaced(option))
                }
              />

              <Tooltip id="iceVehicleReplaced">
                <>TODO</>
              </Tooltip>
            </p>
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
