/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { EERETextInput } from 'app/components/EERETextInput';
import { EERESelectInput } from 'app/components/EERESelectInput';
import {
  EVSalesAndStockTable,
  EEREEVComparisonTable,
} from 'app/components/EVTables';
import { Tooltip } from 'app/components/Tooltip';
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
  updateEereHybridEVs,
  updateEereTransitBuses,
  updateEereSchoolBuses,
  updateEereEVDeploymentLocation,
  updateEereEVModelYear,
  updateEereICEReplacementVehicle,
  calculateEereProfile,
} from 'app/redux/reducers/eere';
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';

const inputsGroupStyles = css`
  ul {
    margin-bottom: 0;
  }

  /* highlight letter when details is open */
  &[open] > summary::before {
    background-color: var(--avert-light-blue);
  }
`;

const inputsSummaryStyles = css`
  /* letter (A, B, C, D, or E) */
  &::before {
    content: attr(data-label);
    flex-shrink: 0;
    margin-right: 0.5rem;
    border-radius: 3px;
    width: 1.75rem;
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.125);
    color: white;
    background-color: #a9aeb1; // base-light
  }

  /* highlight letter on hover */
  &:hover::before {
    background-color: var(--avert-light-blue);
  }
`;

function EEREInputsContent() {
  const dispatch = useDispatch();
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const calculationStatus = useTypedSelector(
    ({ eere }) => eere.calculationStatus,
  );
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
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );
  const evModelYear = useTypedSelector(({ eere }) => eere.inputs.evModelYear);
  const iceReplacementVehicle = useTypedSelector(
    ({ eere }) => eere.inputs.iceReplacementVehicle,
  );
  const evModelYearOptions = useTypedSelector(
    ({ eere }) => eere.selectOptions.evModelYearOptions,
  );
  const iceReplacementVehicleOptions = useTypedSelector(
    ({ eere }) => eere.selectOptions.iceReplacementVehicleOptions,
  );
  const evDeploymentLocationOptions = useTypedSelector(
    ({ eere }) => eere.selectOptions.evDeploymentLocationOptions,
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  // initially set `evDeploymentLocation` to the first calculated location option
  useEffect(() => {
    dispatch(updateEereEVDeploymentLocation(evDeploymentLocationOptions[0].id));
  }, [dispatch, evDeploymentLocationOptions]);

  const [detailsAOpen, setDetailsAOpen] = useState(false);
  const [detailsBOpen, setDetailsBOpen] = useState(false);
  const [detailsCOpen, setDetailsCOpen] = useState(false);
  const [detailsDOpen, setDetailsDOpen] = useState(false);
  const [detailsEOpen, setDetailsEOpen] = useState(false);

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
    !textInputsAreValid ||
    textInputsAreEmpty ||
    calculationStatus === 'pending';

  const eereButtonOptions = {
    idle: 'Calculate EE/RE Impacts',
    pending: 'Calculating...',
    success: 'Recalculate EE/RE Impacts',
  };

  const disabledButtonClassName = calculationDisabled
    ? 'avert-button-disabled'
    : '';

  return (
    <>
      <div
        className={
          `avert-border ` +
          `border-width-1px border-top-width-0 border-x-width-0 border-solid ` +
          `margin-y-3 font-sans-xs text-base-darker`
        }
        data-avert-eere-inputs
      >
        <header
          className={
            `avert-border avert-box-background ` +
            `border-width-1px border-bottom-width-0 border-solid ` +
            `padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <p className="margin-0">Energy Efficiency</p>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div className="grid-row avert-border border-width-1px border-y-width-0 border-solid">
            <div className="desktop:grid-col-6">
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-x-width-0 border-bottom-width-0 border-solid"
                open={detailsAOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsAOpen(details.open);
                  setDetailsBOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="A"
                >
                  Reductions spread evenly throughout the year
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <p className="margin-0">
                    <strong>Choose one:</strong>
                  </p>

                  <div className="tablet:display-flex flex-align-end">
                    <div className="flex-1 tablet:margin-right-2">
                      <EERETextInput
                        label={<>Reduce total annual generation by:</>}
                        ariaLabel="Number of GWh expected to be saved in a single year"
                        suffix="GWh"
                        value={annualGwh}
                        fieldName="annualGwh"
                        disabled={constantMwh}
                        onChange={(text) => dispatch(updateEereAnnualGwh(text))}
                        tooltip={
                          <p className="margin-0">
                            Enter the total number of GWh expected to be saved
                            in a single year. This option simply distributes the
                            total annual savings evenly over all hours of the
                            year. An industrial or refrigeration efficiency
                            program may be well represented by a constant
                            reduction across most hours of the year.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 tablet:margin-left-2">
                      <EERETextInput
                        className="margin-top-1 tablet:margin-top-0"
                        label={<>Reduce hourly generation by:</>}
                        ariaLabel="Constant reduction for every hour of the year, in MW"
                        suffix="MW"
                        value={constantMwh}
                        fieldName="constantMwh"
                        disabled={annualGwh}
                        onChange={(text) =>
                          dispatch(updateEereConstantMw(text))
                        }
                        tooltip={
                          <p className="margin-0">
                            “Reduce hourly generation” is identical in effect to
                            reducing total annual generation. It allows you to
                            enter a constant reduction for every hour of the
                            year, in MW. An industrial or refrigeration
                            efficiency program may be well represented by a
                            constant reduction across most hours of the year.
                          </p>
                        }
                      />
                    </div>
                  </div>
                </section>
              </details>
            </div>

            <div className="desktop:grid-col-6">
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-x-width-0 border-bottom-width-0 border-solid"
                open={detailsBOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsBOpen(details.open);
                  setDetailsAOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="B"
                >
                  Percentage reductions in some or all hours
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <p className="margin-0">
                    <strong>Choose one:</strong>
                  </p>

                  <div className="tablet:display-flex flex-align-start">
                    <div className="flex-1 tablet:margin-right-2">
                      <EERETextInput
                        label={
                          <>
                            <em>Broad-based program:</em> Reduce generation by:
                          </>
                        }
                        ariaLabel="Load reduction percentage applied to all hours of the year"
                        suffix="%&nbsp;in&nbsp;all&nbsp;hours"
                        value={broadProgram}
                        fieldName="broadProgram"
                        disabled={reduction || topHours}
                        onChange={(text) =>
                          dispatch(updateEereBroadBasedProgram(text))
                        }
                        tooltip={
                          <p className="margin-0">
                            To simulate a broad-based efficiency program, enter
                            an estimated load reduction fraction. This
                            percentage reduction will be applied to all hours of
                            the year.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 tablet:margin-left-2">
                      <EERETextInput
                        className="margin-top-1 tablet:margin-top-0"
                        label={
                          <>
                            <em>Targeted program:</em> Reduce generation by:
                          </>
                        }
                        ariaLabel="Load reduction (as a fraction of peaking load) that would be targeted"
                        suffix="%&nbsp;during&nbsp;the&nbsp;peak:&nbsp;&nbsp;"
                        value={reduction}
                        fieldName="reduction"
                        disabled={broadProgram}
                        onChange={(text) => dispatch(updateEereReduction(text))}
                      />

                      <EERETextInput
                        ariaLabel="Fraction of high-demand hours that the program is expected to affect"
                        suffix="%&nbsp;of&nbsp;hours"
                        value={topHours}
                        fieldName="topHours"
                        disabled={broadProgram}
                        onChange={(text) => dispatch(updateEereTopHours(text))}
                        tooltip={
                          <p className="margin-0">
                            To simulate a peak-reduction targeting program such
                            as demand response, enter the load reduction (as a
                            fraction of peaking load) that would be targeted, as
                            well as the fraction of high-demand hours that the
                            program is expected to affect (e.g., 1%–3%).
                          </p>
                        }
                      />
                    </div>
                  </div>
                </section>
              </details>
            </div>
          </div>
        </div>

        <header
          className={
            `avert-border avert-box-background ` +
            `border-width-1px border-bottom-width-0 border-solid ` +
            `padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <p className="margin-0">Renewable Energy</p>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div className="grid-row avert-border border-width-1px border-y-width-0 border-solid">
            <div className="desktop:grid-col-6">
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-x-width-0 border-bottom-width-0 border-solid"
                open={detailsCOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsCOpen(details.open);
                  setDetailsDOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="C"
                >
                  Wind
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="tablet:display-flex flex-align-end">
                    <div className="flex-1 tablet:margin-right-2">
                      <EERETextInput
                        label={<>Onshore wind total capacity:</>}
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={onshoreWind}
                        fieldName="onshoreWind"
                        onChange={(text) =>
                          dispatch(updateEereOnshoreWind(text))
                        }
                        tooltip={
                          <p className="margin-0">
                            Enter the total capacity (maximum potential
                            electricity generation) for this type of resource,
                            measured in MW. The model uses these inputs along
                            with hourly capacity factors that vary by resource
                            type and region.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 tablet:margin-left-2">
                      {atLeastOneRegionSupportsOffshoreWind ? (
                        <EERETextInput
                          label={<>Offshore wind total capacity:</>}
                          ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                          suffix="MW"
                          value={offshoreWind}
                          fieldName="offshoreWind"
                          onChange={(text) =>
                            dispatch(updateEereOffshoreWind(text))
                          }
                          tooltip={
                            <p className="margin-0">
                              Enter the total capacity (maximum potential
                              electricity generation) for this type of resource,
                              measured in MW. The model uses these inputs along
                              with hourly capacity factors that vary by resource
                              type and region.
                            </p>
                          }
                        />
                      ) : geographicFocus === 'regions' ? (
                        <p className="margin-y-05 font-sans-2xs line-height-sans-2 text-italic">
                          Offshore wind calculations are not available in the
                          selected AVERT region{' '}
                          <Tooltip id="no-offshoreWind-region">
                            <span className="margin-0 line-height-sans-3 text-no-italic">
                              AVERT does not support offshore wind modeling in
                              this region. It is unlikely that offshore areas
                              suitable for wind farms would connect to the
                              electrical grid in this region.
                            </span>
                          </Tooltip>
                        </p>
                      ) : (
                        <p className="margin-y-05 font-sans-2xs line-height-sans-2 text-italic">
                          Offshore wind calculations are not available in the
                          AVERT region(s) that this state is part of{' '}
                          <Tooltip id="no-offshoreWind-state">
                            <span className="margin-0 line-height-sans-3 text-no-italic">
                              AVERT does not support offshore wind modeling in
                              the region(s) that this state is part of. It is
                              unlikely that offshore areas suitable for wind
                              farms would connect to the electrical grid in
                              these regions.
                            </span>
                          </Tooltip>
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </details>
            </div>

            <div className="desktop:grid-col-6">
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-x-width-0 border-bottom-width-0 border-solid"
                open={detailsDOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsDOpen(details.open);
                  setDetailsCOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="D"
                >
                  Solar photovoltaic
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="tablet:display-flex flex-align-end">
                    <div className="flex-1 tablet:margin-right-2">
                      <EERETextInput
                        label={
                          <>Utility-scale solar photovoltaic total capacity:</>
                        }
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={utilitySolar}
                        fieldName="utilitySolar"
                        onChange={(text) =>
                          dispatch(updateEereUtilitySolar(text))
                        }
                        tooltip={
                          <p className="margin-0">
                            Enter the total capacity (maximum potential
                            electricity generation) for this type of resource,
                            measured in MW. The model uses these inputs along
                            with hourly capacity factors that vary by resource
                            type and region.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 tablet:margin-left-2">
                      <EERETextInput
                        className="margin-top-1 tablet:margin-top-0"
                        label={
                          <>
                            Distributed (rooftop) solar photovoltaic total
                            capacity:
                          </>
                        }
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={rooftopSolar}
                        fieldName="rooftopSolar"
                        onChange={(text) =>
                          dispatch(updateEereRooftopSolar(text))
                        }
                        tooltip={
                          <p className="margin-0">
                            Enter the total capacity (maximum potential
                            electricity generation) for this type of resource,
                            measured in MW. The model uses these inputs along
                            with hourly capacity factors that vary by resource
                            type and region.
                          </p>
                        }
                      />
                    </div>
                  </div>
                </section>
              </details>
            </div>
          </div>
        </div>

        <header
          className={
            `avert-border avert-box-background ` +
            `border-width-1px border-bottom-width-0 border-solid ` +
            `padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <p className="margin-0">Electric Vehicles</p>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div className="grid-row avert-border border-width-1px border-y-width-0 border-solid">
            <div className="desktop:grid-col-12">
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-x-width-0 border-bottom-width-0 border-solid"
                open={detailsEOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsEOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="E"
                >
                  Electric Vehicles
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="grid-row">
                    <div className="desktop:grid-col-6">
                      <div className="tablet:display-flex flex-align-end desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <EERETextInput
                            label={<>Light-duty battery EVs:</>}
                            ariaLabel="TODO"
                            value={batteryEVs}
                            fieldName="batteryEVs"
                            onChange={(text) =>
                              dispatch(updateEereBatteryEVs(text))
                            }
                            tooltip={<p className="margin-0">TODO</p>}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          <EERETextInput
                            className="margin-top-1"
                            label={<>Light-duty plug-in hybrid EVs:</>}
                            ariaLabel="TODO"
                            value={hybridEVs}
                            fieldName="hybridEVs"
                            onChange={(text) =>
                              dispatch(updateEereHybridEVs(text))
                            }
                            tooltip={<p className="margin-0">TODO</p>}
                          />
                        </div>
                      </div>

                      <div className="tablet:display-flex flex-align-end desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <EERETextInput
                            className="margin-top-1 tablet:margin-top-0 desktop:margin-top-1"
                            label={<>Electric transit buses:</>}
                            ariaLabel="TODO"
                            value={transitBuses}
                            fieldName="transitBuses"
                            onChange={(text) =>
                              dispatch(updateEereTransitBuses(text))
                            }
                            tooltip={<p className="margin-0">TODO</p>}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          <EERETextInput
                            className="margin-top-1"
                            label={<>Electric school buses:</>}
                            ariaLabel="TODO"
                            value={schoolBuses}
                            fieldName="schoolBuses"
                            onChange={(text) =>
                              dispatch(updateEereSchoolBuses(text))
                            }
                            tooltip={<p className="margin-0">TODO</p>}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="desktop:grid-col-6">
                      <div className="margin-top-2 desktop:margin-top-0 desktop:margin-left-2">
                        <EVSalesAndStockTable className="width-full" />
                      </div>
                    </div>
                  </div>

                  <div className="margin-top-2 desktop:display-flex">
                    <div className="flex-1 desktop:margin-right-2">
                      <EERESelectInput
                        label="Location of EV deployment:"
                        ariaLabel="TODO"
                        options={evDeploymentLocationOptions}
                        value={evDeploymentLocation}
                        fieldName="evDeploymentLocation"
                        onChange={(option) =>
                          dispatch(updateEereEVDeploymentLocation(option))
                        }
                        tooltip={<p className="margin-0">TODO</p>}
                      />
                    </div>

                    <div className="flex-1 desktop:margin-x-2">
                      <EERESelectInput
                        className="margin-top-1 desktop:margin-top-0"
                        label="EV model year:"
                        ariaLabel="TODO"
                        options={evModelYearOptions}
                        value={evModelYear}
                        fieldName="evModelYear"
                        onChange={(option) =>
                          dispatch(updateEereEVModelYear(option))
                        }
                        tooltip={<p className="margin-0">TODO</p>}
                      />
                    </div>

                    <div className="flex-1 desktop:margin-left-2">
                      <EERESelectInput
                        className="margin-top-1 desktop:margin-top-0"
                        label="ICE vehicle being replaced:"
                        ariaLabel="TODO"
                        options={iceReplacementVehicleOptions}
                        value={iceReplacementVehicle}
                        fieldName="iceReplacementVehicle"
                        onChange={(option) =>
                          dispatch(updateEereICEReplacementVehicle(option))
                        }
                        tooltip={<p className="margin-0">TODO</p>}
                      />
                    </div>
                  </div>

                  <EEREEVComparisonTable className="width-full" />
                </section>
              </details>
            </div>
          </div>
        </div>
      </div>

      <p className="margin-bottom-2 text-center">
        <a
          className={`usa-button avert-button ${disabledButtonClassName}`}
          href="/"
          onClick={(ev) => {
            ev.preventDefault();
            if (calculationDisabled) return;
            dispatch(calculateEereProfile());
          }}
          data-avert-calculate-impacts-btn
        >
          {eereButtonOptions[calculationStatus]}
        </a>
      </p>
    </>
  );
}

export function EEREInputs() {
  return (
    <ErrorBoundary
      message={
        <>
          EE/RE Impacts inputs error. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <EEREInputsContent />
    </ErrorBoundary>
  );
}
