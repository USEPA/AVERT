/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { ImpactsTextInput } from 'app/components/ImpactsTextInput';
import { ImpactsSelectInput } from 'app/components/ImpactsSelectInput';
import {
  EVSalesAndStockTable,
  EEREEVComparisonTable,
} from 'app/components/EVTables';
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { displayModalDialog } from 'app/redux/reducers/panel';
import type {
  GeographicFocus,
  RegionState,
} from 'app/redux/reducers/geography';
import {
  updateEEAnnualGwh,
  updateEEConstantMw,
  updateEEBroadBasedProgram,
  updateEEReduction,
  updateEETopHours,
  updateREOnshoreWind,
  updateREOffshoreWind,
  updateREUtilitySolar,
  updateRERooftopSolar,
  updateESUtilityStorage,
  updateESRooftopStorage,
  updateESMaxAnnualDischargeCycles,
  updateEVBatteryEVs,
  runEVBatteryEVsCalculations,
  updateEVHybridEVs,
  runEVHybridEVsCalculations,
  updateEVTransitBuses,
  runEVTransitBusesCalculations,
  updateEVSchoolBuses,
  runEVSchoolBusesCalculations,
  updateEVDeploymentLocation,
  updateEVModelYear,
  updateEVICEReplacementVehicle,
  calculateHourlyEnergyProfile,
} from 'app/redux/reducers/impacts';
import { useSelectedRegion, useSelectedStateRegions } from 'app/hooks';
import { batteryStorageDuration } from 'app/config';

const inputsGroupStyles = css`
  ul {
    margin-bottom: 0;
  }

  /* highlight letter when details is open */
  &[open] > summary::before {
    background-color: var(--avert-blue);
  }
`;

const inputsSummaryStyles = css`
  &::-webkit-details-marker,
  &::marker {
    display: none;
    content: '';
  }

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
    background-color: var(--avert-blue);
  }
`;

/**
 * Checks the conditions necessary that would require displaying a transit buses
 * warning modal dialog.
 */
function checkTransitBusesWarningScenario(options: {
  geographicFocus: GeographicFocus;
  selectedRegion: RegionState | undefined;
  evDeploymentLocation: string;
  transitBuses: string;
}) {
  const {
    geographicFocus,
    selectedRegion,
    evDeploymentLocation,
    transitBuses,
  } = options;

  return (
    geographicFocus === 'regions' &&
    selectedRegion?.id === 'RM' &&
    ['state-MT', 'state-UT'].includes(evDeploymentLocation) &&
    transitBuses !== '' &&
    transitBuses !== '0'
  );
}

/**
 * Warning dialog text to display when under the transit buses warning scenario.
 */
function TransitBusesWarningText() {
  return (
    <p className="margin-0">
      <strong>Error:</strong> You have entered a quantity of transit buses in a
      region/state combination that does not currently have transit buses.
      Please select a different region or state, or change the modeled quantity
      of transit buses to zero.
    </p>
  );
}

function ImpactsInputsContent() {
  const dispatch = useDispatch();
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const hourlyEnergyProfile = useTypedSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );
  const errors = useTypedSelector(({ impacts }) => impacts.errors);
  const inputs = useTypedSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useTypedSelector(
    ({ impacts }) => impacts.selectOptions,
  );

  const {
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
    utilityStorage,
    rooftopStorage,
    maxAnnualDischargeCycles,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = inputs;

  const {
    maxAnnualDischargeCyclesOptions,
    evModelYearOptions,
    iceReplacementVehicleOptions,
    evDeploymentLocationOptions,
  } = selectOptions;

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  // initially set `evDeploymentLocation` to the first calculated location option
  useEffect(() => {
    dispatch(updateEVDeploymentLocation(evDeploymentLocationOptions[0].id));
  }, [dispatch, evDeploymentLocationOptions]);

  const [detailsAOpen, setDetailsAOpen] = useState(false);
  const [detailsBOpen, setDetailsBOpen] = useState(false);
  const [detailsCOpen, setDetailsCOpen] = useState(false);
  const [detailsDOpen, setDetailsDOpen] = useState(false);
  const [detailsEOpen, setDetailsEOpen] = useState(false);
  const [detailsFOpen, setDetailsFOpen] = useState(false);

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

  const utilityStorageMWh = isNaN(Number(utilityStorage))
    ? 0
    : Number(utilityStorage) * batteryStorageDuration;

  const rooftopStorageMWh = isNaN(Number(rooftopStorage))
    ? 0
    : Number(rooftopStorage) * batteryStorageDuration;

  const textInputsAreEmpty =
    textInputsFields.filter((field) => field?.length > 0).length === 0;

  const hourlyEnergyProfileCalculationDisabled =
    !textInputsAreValid ||
    textInputsAreEmpty ||
    hourlyEnergyProfile.status === 'pending';

  const impactsButtonOptions = {
    idle: 'Calculate Energy Impacts',
    pending: 'Calculating...',
    success: 'Recalculate Energy Impacts',
  };

  const disabledButtonClassName = hourlyEnergyProfileCalculationDisabled
    ? 'avert-button-disabled'
    : '';

  const evInputErrorMessage = (
    <>
      <span className="display-block text-bold text-no-italic">
        Please enter a positive whole number.
      </span>
      If you wish to model a reverse energy impacts scenario (i.e., a negative
      number), use the Excel version of the AVERT Main Module.
    </>
  );

  return (
    <>
      <div
        className="margin-y-3 font-sans-xs text-base-darker"
        data-avert-energy-impacts-inputs
      >
        <header
          className={
            `avert-border avert-box-background ` +
            `border-width-1px border-bottom-width-0 border-solid ` +
            `padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <h3 className="margin-0 font-sans-xs line-height-sans-3">
            Energy Efficiency
          </h3>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div
            className={
              `grid-row ` +
              `avert-border border-width-1px border-top-width-0 border-right-width-0 border-solid`
            }
          >
            <div
              className={
                `desktop:grid-col-6 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
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
                  <span className="display-none">A.</span>
                  Reductions spread evenly throughout the year
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <p className="margin-0">
                    <strong>Choose one:</strong>
                  </p>

                  <div className="tablet:display-flex">
                    <div className="flex-1 tablet:margin-right-2">
                      <ImpactsTextInput
                        label={<>Reduce total annual generation by:</>}
                        ariaLabel="Number of GWh expected to be saved in a single year"
                        suffix="GWh"
                        value={annualGwh}
                        fieldName="annualGwh"
                        disabled={constantMwh}
                        onChange={(value) => {
                          dispatch(updateEEAnnualGwh(value));
                        }}
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
                      <ImpactsTextInput
                        className="margin-top-1 tablet:margin-top-0"
                        label={<>Reduce hourly generation by:</>}
                        ariaLabel="Constant reduction for every hour of the year, in MW"
                        suffix="MW"
                        value={constantMwh}
                        fieldName="constantMwh"
                        disabled={annualGwh}
                        onChange={(value) => {
                          dispatch(updateEEConstantMw(value));
                        }}
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

            <div
              className={
                `desktop:grid-col-6 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
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
                  <span className="display-none">B.</span>
                  Percentage reductions in some or all hours
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <p className="margin-0">
                    <strong>Choose one:</strong>
                  </p>

                  <div className="tablet:display-flex">
                    <div className="flex-1 tablet:margin-right-2">
                      <ImpactsTextInput
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
                        onChange={(value) => {
                          dispatch(updateEEBroadBasedProgram(value));
                        }}
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
                      <ImpactsTextInput
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
                        onChange={(value) => {
                          dispatch(updateEEReduction(value));
                        }}
                      />

                      <ImpactsTextInput
                        ariaLabel="Fraction of high-demand hours that the program is expected to affect"
                        suffix="%&nbsp;of&nbsp;hours"
                        value={topHours}
                        fieldName="topHours"
                        disabled={broadProgram}
                        onChange={(value) => {
                          dispatch(updateEETopHours(value));
                        }}
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
            `margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <h3 className="margin-0 font-sans-xs line-height-sans-3">
            Renewable Energy
          </h3>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div
            className={
              `grid-row ` +
              `avert-border border-width-1px border-top-width-0 border-right-width-0 border-solid`
            }
          >
            <div
              className={
                `desktop:grid-col-6 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
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
                  <span className="display-none">C.</span>
                  Wind
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="tablet:display-flex">
                    <div className="flex-1 tablet:margin-right-2">
                      <ImpactsTextInput
                        label={<>Onshore wind total capacity:</>}
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={onshoreWind}
                        fieldName="onshoreWind"
                        onChange={(value) => {
                          dispatch(updateREOnshoreWind(value));
                        }}
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
                        <ImpactsTextInput
                          label={<>Offshore wind total capacity:</>}
                          ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                          suffix="MW"
                          value={offshoreWind}
                          fieldName="offshoreWind"
                          onChange={(value) => {
                            dispatch(updateREOffshoreWind(value));
                          }}
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
                          <Tooltip>
                            <span className="text-no-italic">
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
                          <Tooltip>
                            <span className="text-no-italic">
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

            <div
              className={
                `desktop:grid-col-6 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
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
                  <span className="display-none">D.</span>
                  Solar photovoltaic (PV)
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="tablet:display-flex">
                    <div className="flex-1 tablet:margin-right-2">
                      <ImpactsTextInput
                        label={<>Utility-scale solar PV total capacity:</>}
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={utilitySolar}
                        fieldName="utilitySolar"
                        onChange={(value) => {
                          dispatch(updateREUtilitySolar(value));
                        }}
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
                      <ImpactsTextInput
                        className="margin-top-1 tablet:margin-top-0"
                        label={
                          <>Distributed (rooftop) solar PV total capacity:</>
                        }
                        ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                        suffix="MW"
                        value={rooftopSolar}
                        fieldName="rooftopSolar"
                        onChange={(value) => {
                          dispatch(updateRERooftopSolar(value));
                        }}
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
            `margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <h3 className="margin-0 font-sans-xs line-height-sans-3">
            Electric Vehicles
          </h3>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div
            className={
              `grid-row ` +
              `avert-border border-width-1px border-top-width-0 border-right-width-0 border-solid`
            }
          >
            <div
              className={
                `desktop:grid-col-12 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
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
                  <span className="display-none">E.</span>
                  Electric vehicles
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="grid-row">
                    <div className="desktop:grid-col-6">
                      <div className="tablet:display-flex desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <ImpactsTextInput
                            label={<>Light-duty battery EVs:</>}
                            ariaLabel="Number of light-duty battery EVs to be added to the road"
                            value={batteryEVs}
                            fieldName="batteryEVs"
                            onChange={(value) => {
                              dispatch(updateEVBatteryEVs(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVBatteryEVsCalculations(value));
                            }}
                            tooltip={
                              <p className="margin-0">
                                Enter the number of light-duty battery EVs to be
                                added to the road.
                              </p>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          <ImpactsTextInput
                            className="margin-top-1 tablet:margin-top-0"
                            label={<>Light-duty plug-in hybrid EVs:</>}
                            ariaLabel="Number of light-duty plug-in hybrid EVs to be added to the road"
                            value={hybridEVs}
                            fieldName="hybridEVs"
                            onChange={(value) => {
                              dispatch(updateEVHybridEVs(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVHybridEVsCalculations(value));
                            }}
                            tooltip={
                              <p className="margin-0">
                                Enter the number of light-duty plug-in hybrid
                                EVs to be added to the road.
                              </p>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>
                      </div>

                      <div className="tablet:display-flex desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <ImpactsTextInput
                            className="margin-top-1"
                            label={<>Electric transit buses:</>}
                            ariaLabel="Number of electric transit buses to be added to the road"
                            value={transitBuses}
                            fieldName="transitBuses"
                            onChange={(value) => {
                              dispatch(updateEVTransitBuses(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVTransitBusesCalculations(value));

                              if (
                                checkTransitBusesWarningScenario({
                                  geographicFocus,
                                  selectedRegion,
                                  evDeploymentLocation,
                                  transitBuses: value,
                                })
                              ) {
                                dispatch(
                                  displayModalDialog(
                                    <TransitBusesWarningText />,
                                  ),
                                );
                              }
                            }}
                            tooltip={
                              <p className="margin-0">
                                Enter the number of electric transit buses to be
                                added to the road.
                              </p>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          <ImpactsTextInput
                            className="margin-top-1"
                            label={<>Electric school buses:</>}
                            ariaLabel="Number of electric school buses to be added to the road"
                            value={schoolBuses}
                            fieldName="schoolBuses"
                            onChange={(value) => {
                              dispatch(updateEVSchoolBuses(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVSchoolBusesCalculations(value));
                            }}
                            tooltip={
                              <p className="margin-0">
                                Enter the number of electric school buses to be
                                added to the road.
                              </p>
                            }
                            errorMessage={evInputErrorMessage}
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
                      <ImpactsSelectInput
                        label="Location of EV deployment:"
                        ariaLabel="Location of EV deployment"
                        options={evDeploymentLocationOptions}
                        value={evDeploymentLocation}
                        fieldName="evDeploymentLocation"
                        onChange={(option) => {
                          dispatch(updateEVDeploymentLocation(option));

                          if (
                            checkTransitBusesWarningScenario({
                              geographicFocus,
                              selectedRegion,
                              evDeploymentLocation: option,
                              transitBuses,
                            })
                          ) {
                            dispatch(
                              displayModalDialog(<TransitBusesWarningText />),
                            );
                          }
                        }}
                        tooltip={
                          <p className="margin-0">
                            Select the location of EV deployment. While AVERT’s
                            power sector modeling algorithm is agnostic to where
                            electricity load changes occur within an AVERT
                            region, this parameter determines where emission
                            decreases from displaced internal combustion engine
                            vehicles occur.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 desktop:margin-x-2">
                      <ImpactsSelectInput
                        className="margin-top-1 desktop:margin-top-0"
                        label="EV model year:"
                        ariaLabel="Model year of the modeled electric vehicles"
                        options={evModelYearOptions}
                        value={evModelYear}
                        fieldName="evModelYear"
                        onChange={(option) => {
                          dispatch(updateEVModelYear(option));
                        }}
                        tooltip={
                          <p className="margin-0">
                            Select the model year of the electric vehicles
                            entered in the scenario. This parameter determines
                            the modeled EVs’ efficiencies and the emission rates
                            of the displaced internal combustion engine (ICE)
                            vehicles if “new” is selected for the ICE vehicles
                            being replaced. This parameter determines only the
                            modeled EVs’ efficiencies if “existing” is selected
                            for the ICE vehicles being replaced.
                          </p>
                        }
                      />
                    </div>

                    <div className="flex-1 desktop:margin-left-2">
                      <ImpactsSelectInput
                        className="margin-top-1 desktop:margin-top-0"
                        label="ICE vehicles being replaced:"
                        ariaLabel="EV to displace a “new” or the average “existing” internal combustion engine vehicle"
                        options={iceReplacementVehicleOptions}
                        value={iceReplacementVehicle}
                        fieldName="iceReplacementVehicle"
                        onChange={(option) => {
                          dispatch(updateEVICEReplacementVehicle(option));
                        }}
                        tooltip={
                          <p className="margin-0">
                            Select “new” or “existing” based on whether the EVs
                            entered in the scenario will displace a “new”
                            internal combustion engine (ICE) vehicle with the
                            same model year as the EV model year or the average
                            “existing” ICE vehicle. “New” ICE model years have
                            lower avoided vehicle emissions than the “existing”
                            fleet, which is the fleet average of the “EV model
                            year” selected.
                          </p>
                        }
                      />
                    </div>
                  </div>

                  <EEREEVComparisonTable className="width-full" />
                </section>
              </details>
            </div>
          </div>
        </div>

        <header
          className={
            `avert-border avert-box-background ` +
            `border-width-1px border-bottom-width-0 border-solid ` +
            `margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest`
          }
        >
          <h3 className="margin-0 font-sans-xs line-height-sans-3">
            Energy Storage
          </h3>
        </header>

        <div className="grid-container padding-0 maxw-full">
          <div
            className={
              `grid-row ` +
              `avert-border border-width-1px border-top-width-0 border-right-width-0 border-solid`
            }
          >
            <div
              className={
                `desktop:grid-col-12 ` +
                `avert-border border-width-1px border-y-width-0 border-left-width-0 border-solid`
              }
            >
              <details
                css={inputsGroupStyles}
                className="avert-border border-width-1px border-bottom-width-0 border-x-width-0 border-solid"
                open={detailsFOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsFOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={
                    `avert-summary ` +
                    `display-flex flex-align-center padding-105 ` +
                    `line-height-sans-2 text-bold cursor-pointer`
                  }
                  data-label="F"
                >
                  <span className="display-none">F.</span>
                  Energy storage (paired with solar generation)
                </summary>

                <section className="padding-top-0 padding-x-2 padding-bottom-105">
                  <div className="grid-row">
                    <div className="desktop:grid-col-6">
                      <div className="tablet:display-flex desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <ImpactsTextInput
                            label={<>Utility-scale storage capacity:</>}
                            ariaLabel="Max theoretical power that the utility-scale resource can discharge"
                            suffix="MW"
                            value={utilityStorage}
                            fieldName="utilityStorage"
                            onChange={(value) => {
                              dispatch(updateESUtilityStorage(value));
                            }}
                            tooltip={<p className="margin-0">(TODO)</p>}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          <ImpactsTextInput
                            className="margin-top-1 tablet:margin-top-0"
                            label={<>Distributed storage capacity:</>}
                            ariaLabel="Max theoretical power that the distributed resource can discharge"
                            suffix="MW"
                            value={rooftopStorage}
                            fieldName="rooftopStorage"
                            onChange={(value) => {
                              dispatch(updateESRooftopStorage(value));
                            }}
                            tooltip={<p className="margin-0">(TODO)</p>}
                          />
                        </div>
                      </div>

                      <div className="tablet:display-flex desktop:margin-right-2">
                        <div className="flex-1 tablet:margin-right-2">
                          <ImpactsSelectInput
                            className="margin-top-1"
                            label="Maximum allowable discharge cycles per year:"
                            ariaLabel="Maximum allowable discharge cycles per year"
                            options={maxAnnualDischargeCyclesOptions}
                            value={maxAnnualDischargeCycles}
                            fieldName="maxAnnualDischargeCycles"
                            onChange={(option) => {
                              dispatch(
                                updateESMaxAnnualDischargeCycles(option),
                              );
                            }}
                            tooltip={<p className="margin-0">(TODO)</p>}
                          />
                        </div>

                        <div className="flex-1 tablet:margin-left-2">
                          &nbsp;
                        </div>
                      </div>
                    </div>

                    <div className="desktop:grid-col-6">
                      <div className="margin-top-2 desktop:margin-top-0 desktop:margin-left-2">
                        {/* TODO: swap the table and the select input's position */}
                        <div className="overflow-auto">
                          <div className="avert-table-container">
                            <table className="avert-table avert-table-striped avert-table-fixed width-full">
                              <thead>
                                <tr>
                                  <th scope="col">Storage Type</th>
                                  <th scope="col">
                                    Storage Energy <small>(MWh)</small>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <th scope="row">Utility-scale</th>
                                  <td>{utilityStorageMWh}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Distributed</th>
                                  <td>{rooftopStorageMWh}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            if (hourlyEnergyProfileCalculationDisabled) return;
            dispatch(calculateHourlyEnergyProfile());
          }}
          data-avert-calculate-impacts-btn
        >
          {impactsButtonOptions[hourlyEnergyProfile.status]}
        </a>
      </p>
    </>
  );
}

export function ImpactsInputs() {
  return (
    <ErrorBoundary
      message={
        <>
          Energy Impacts inputs error. Please contact AVERT support at{' '}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <ImpactsInputsContent />
    </ErrorBoundary>
  );
}
