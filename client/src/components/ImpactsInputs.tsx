/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ImpactsTextInput } from "@/components/ImpactsTextInput";
import { ImpactsSelectInput } from "@/components/ImpactsSelectInput";
import {
  EVSalesAndStockTable,
  EEREEVComparisonTable,
} from "@/components/EVTables";
import { Tooltip } from "@/components/Tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/index";
import { displayModalDialog } from "@/redux/reducers/panel";
import {
  type GeographicFocus,
  type RegionState,
} from "@/redux/reducers/geography";
import {
  updateEEAnnualGwhReduction,
  updateEEHourlyMwReduction,
  updateEEBroadProgramReduction,
  updateEETargetedProgramReduction,
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
  updateEVShortHaulTrucks,
  runEVShortHaulTrucksCalculations,
  updateEVComboLongHaulTrucks,
  runEVComboLongHaulTrucksCalculations,
  updateEVRefuseTrucks,
  runEVRefuseTrucksCalculations,
  updateEVDeploymentLocation,
  updateEVModelYear,
  updateEVICEReplacementVehicle,
  calculateHourlyEnergyProfile,
} from "@/redux/reducers/impacts";
import { useSelectedRegion, useSelectedStateRegions } from "@/hooks";
import { batteryStorageDuration } from "@/config";

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
    content: "";
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
    geographicFocus === "regions" &&
    selectedRegion?.id === "RM" &&
    ["state-MT", "state-UT"].includes(evDeploymentLocation) &&
    transitBuses !== "" &&
    transitBuses !== "0"
  );
}

/**
 * Checks if the input is not an empty string or zero.
 */
function nonZeroInput(input: string) {
  return input !== "" && Number(input) !== 0;
}

/**
 * Warning dialog text to display when under the transit buses warning scenario.
 */
function TransitBusesWarningText() {
  return (
    <p className={clsx("margin-0")}>
      <strong>Error:</strong> You have entered a quantity of transit buses in a
      region/state combination that does not currently have transit buses.
      Please select a different region or state, or change the modeled quantity
      of transit buses to zero.
    </p>
  );
}

function ImpactsInputsContent() {
  const dispatch = useAppDispatch();
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );
  const errors = useAppSelector(({ impacts }) => impacts.errors);
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useAppSelector(({ impacts }) => impacts.selectOptions);

  const {
    hourlyMwReduction,
    annualGwhReduction,
    broadProgramReduction,
    targetedProgramReduction,
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
    shortHaulTrucks,
    comboLongHaulTrucks,
    refuseTrucks,
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
    geographicFocus === "regions"
      ? selectedRegion?.offshoreWind
      : selectedStateRegions.some((region) => region.offshoreWind);

  const textInputsAreValid = errors.length === 0;

  // text input values from fields
  const textInputsFields = [
    annualGwhReduction,
    hourlyMwReduction,
    broadProgramReduction,
    targetedProgramReduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
    utilityStorage,
    rooftopStorage,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    shortHaulTrucks,
    comboLongHaulTrucks,
    refuseTrucks,
  ];

  const utilityStorageMWh = isNaN(Number(utilityStorage))
    ? 0
    : Number(utilityStorage) * batteryStorageDuration;

  const rooftopStorageMWh = isNaN(Number(rooftopStorage))
    ? 0
    : Number(rooftopStorage) * batteryStorageDuration;

  const utilityStorageError =
    nonZeroInput(utilityStorage) && !nonZeroInput(utilitySolar);

  const rooftopStorageError =
    nonZeroInput(rooftopStorage) && !nonZeroInput(rooftopSolar);

  const textInputsAreEmpty =
    textInputsFields.filter((field) => field?.length > 0).length === 0;

  const hourlyEnergyProfileCalculationDisabled =
    !textInputsAreValid ||
    textInputsAreEmpty ||
    utilityStorageError ||
    rooftopStorageError ||
    hourlyEnergyProfile.status === "pending";

  const impactsButtonOptions = {
    idle: "Calculate Energy Impacts",
    pending: "Calculating...",
    success: "Recalculate Energy Impacts",
  };

  const disabledButtonClassName = hourlyEnergyProfileCalculationDisabled
    ? "avert-button-disabled"
    : "";

  const evInputErrorMessage = (
    <>
      <span className={clsx("display-block text-bold text-no-italic")}>
        Please enter a positive whole number.
      </span>
      If you wish to model a reverse energy impacts scenario (i.e., a negative
      number), use the Excel version of the AVERT Main Module.
    </>
  );

  return (
    <>
      <div
        className={clsx("margin-y-3 font-sans-xs text-base-darker")}
        data-avert-energy-impacts-inputs
      >
        <header
          className={clsx(
            "avert-border avert-box-background",
            "border-width-1px border-bottom-width-0 border-solid padding-y-1 padding-x-105 text-bold bg-base-lightest",
          )}
        >
          <h3 className={clsx("margin-0 font-sans-xs line-height-sans-4")}>
            Energy Efficiency
          </h3>
        </header>

        <div className={clsx("grid-container padding-0 maxw-full")}>
          <div
            className={clsx(
              "avert-border",
              "grid-row border-width-1px border-top-width-0 border-right-width-0 border-solid",
            )}
          >
            <div
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-6",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsAOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsAOpen(details.open);
                  setDetailsBOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="A"
                >
                  <span className={clsx("display-none")}>A.</span>
                  Reductions spread evenly throughout the year
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <p className={clsx("margin-0")}>
                    <strong>Choose one:</strong>
                  </p>

                  <div className={clsx("tablet:display-flex")}>
                    <div className={clsx("flex-1", "tablet:margin-right-2")}>
                      <ImpactsTextInput
                        label={<>Reduce total annual generation by:</>}
                        ariaLabel="Number of GWh expected to be saved in a single year"
                        suffix="GWh"
                        value={annualGwhReduction}
                        fieldName="annualGwhReduction"
                        disabled={nonZeroInput(hourlyMwReduction)}
                        onChange={(value) => {
                          dispatch(updateEEAnnualGwhReduction(value));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
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

                    <div className={clsx("flex-1", "tablet:margin-left-2")}>
                      <ImpactsTextInput
                        className={clsx("margin-top-1", "tablet:margin-top-0")}
                        label={<>Reduce hourly generation by:</>}
                        ariaLabel="Constant reduction for every hour of the year, in MW"
                        suffix="MW"
                        value={hourlyMwReduction}
                        fieldName="hourlyMwReduction"
                        disabled={nonZeroInput(annualGwhReduction)}
                        onChange={(value) => {
                          dispatch(updateEEHourlyMwReduction(value));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
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
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-6",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsBOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsBOpen(details.open);
                  setDetailsAOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="B"
                >
                  <span className={clsx("display-none")}>B.</span>
                  Percentage reductions in some or all hours
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <p className={clsx("margin-0")}>
                    <strong>Choose one:</strong>
                  </p>

                  <div className={clsx("tablet:display-flex")}>
                    <div className={clsx("flex-1", "tablet:margin-right-2")}>
                      <ImpactsTextInput
                        label={
                          <>
                            <em>Broad-based program:</em> Reduce generation by:
                          </>
                        }
                        ariaLabel="Load reduction percentage applied to all hours of the year"
                        suffix="%&nbsp;in&nbsp;all&nbsp;hours"
                        value={broadProgramReduction}
                        fieldName="broadProgramReduction"
                        disabled={
                          nonZeroInput(targetedProgramReduction) ||
                          nonZeroInput(topHours)
                        }
                        onChange={(value) => {
                          dispatch(updateEEBroadProgramReduction(value));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
                            To simulate a broad-based efficiency program, enter
                            an estimated load reduction fraction. This
                            percentage reduction will be applied to all hours of
                            the year.
                          </p>
                        }
                      />
                    </div>

                    <div className={clsx("flex-1", "tablet:margin-left-2")}>
                      <ImpactsTextInput
                        className={clsx("margin-top-1", "tablet:margin-top-0")}
                        label={
                          <>
                            <em>Targeted program:</em> Reduce generation by:
                          </>
                        }
                        ariaLabel="Load reduction (as a fraction of peaking load) that would be targeted"
                        suffix="%&nbsp;during&nbsp;the&nbsp;peak:&nbsp;&nbsp;"
                        value={targetedProgramReduction}
                        fieldName="targetedProgramReduction"
                        disabled={nonZeroInput(broadProgramReduction)}
                        onChange={(value) => {
                          dispatch(updateEETargetedProgramReduction(value));
                        }}
                      />

                      <ImpactsTextInput
                        ariaLabel="Fraction of high-demand hours that the program is expected to affect"
                        suffix="%&nbsp;of&nbsp;hours"
                        value={topHours}
                        fieldName="topHours"
                        disabled={nonZeroInput(broadProgramReduction)}
                        onChange={(value) => {
                          dispatch(updateEETopHours(value));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
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
          className={clsx(
            "avert-border avert-box-background",
            "border-width-1px border-bottom-width-0 border-solid margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest",
          )}
        >
          <h3 className={clsx("margin-0 font-sans-xs line-height-sans-4")}>
            Renewable Energy
          </h3>
        </header>

        <div className={clsx("grid-container padding-0 maxw-full")}>
          <div
            className={clsx(
              "avert-border",
              "grid-row border-width-1px border-top-width-0 border-right-width-0 border-solid",
            )}
          >
            <div
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-6",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsCOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsCOpen(details.open);
                  setDetailsDOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="C"
                >
                  <span className={clsx("display-none")}>C.</span>
                  Wind
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <div className={clsx("tablet:display-flex")}>
                    <div className={clsx("flex-1", "tablet:margin-right-2")}>
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
                          <p className={clsx("margin-0")}>
                            Enter the total capacity (maximum potential
                            electricity generation) for this type of resource,
                            measured in MW. The model uses these inputs along
                            with hourly capacity factors that vary by resource
                            type and region.
                          </p>
                        }
                      />
                    </div>

                    <div className={clsx("flex-1", "tablet:margin-left-2")}>
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
                            <p className={clsx("margin-0")}>
                              Enter the total capacity (maximum potential
                              electricity generation) for this type of resource,
                              measured in MW. The model uses these inputs along
                              with hourly capacity factors that vary by resource
                              type and region.
                            </p>
                          }
                        />
                      ) : geographicFocus === "regions" ? (
                        <p
                          className={clsx(
                            "margin-y-05 font-sans-2xs line-height-sans-2 text-italic",
                          )}
                        >
                          Offshore wind calculations are not available in the
                          selected AVERT region{" "}
                          <Tooltip>
                            <span className={clsx("text-no-italic")}>
                              AVERT does not support offshore wind modeling in
                              this region. It is unlikely that offshore areas
                              suitable for wind farms would connect to the
                              electrical grid in this region.
                            </span>
                          </Tooltip>
                        </p>
                      ) : (
                        <p
                          className={clsx(
                            "margin-y-05 font-sans-2xs line-height-sans-2 text-italic",
                          )}
                        >
                          Offshore wind calculations are not available in the
                          AVERT region(s) that this state is part of{" "}
                          <Tooltip>
                            <span className={clsx("text-no-italic")}>
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
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-6",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsDOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsDOpen(details.open);
                  setDetailsCOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="D"
                >
                  <span className={clsx("display-none")}>D.</span>
                  Solar photovoltaic (PV)
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <div className={clsx("tablet:display-flex")}>
                    <div className={clsx("flex-1", "tablet:margin-right-2")}>
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
                          <p className={clsx("margin-0")}>
                            Enter the total capacity (maximum potential
                            electricity generation) for this type of resource,
                            measured in MW. The model uses these inputs along
                            with hourly capacity factors that vary by resource
                            type and region.
                          </p>
                        }
                      />
                    </div>

                    <div className={clsx("flex-1", "tablet:margin-left-2")}>
                      <ImpactsTextInput
                        className={clsx("margin-top-1", "tablet:margin-top-0")}
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
                          <p className={clsx("margin-0")}>
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
          className={clsx(
            "avert-border avert-box-background",
            "border-width-1px border-bottom-width-0 border-solid margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest",
          )}
        >
          <h3 className={clsx("margin-0 font-sans-xs line-height-sans-4")}>
            Electric Vehicles
          </h3>
        </header>

        <div className={clsx("grid-container padding-0 maxw-full")}>
          <div
            className={clsx(
              "avert-border",
              "grid-row border-width-1px border-top-width-0 border-right-width-0 border-solid",
            )}
          >
            <div
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-12",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsEOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsEOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="E"
                >
                  <span className={clsx("display-none")}>E.</span>
                  Electric vehicles
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <div className={clsx("grid-row")}>
                    <div className={clsx("desktop:grid-col-6")}>
                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
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
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of light-duty battery EVs to
                                  be added to the road.
                                </p>

                                <p>
                                  Light duty passenger vehicles are smaller than
                                  8,500 lb.
                                </p>

                                <p>
                                  By default, AVERT assumes that light duty
                                  vehicle efficiencies are a weighted average of
                                  40% passenger cars (which include hatchbacks,
                                  sedans, and small SUVs ) and 60% passenger
                                  trucks (which include medium and large SUVs,
                                  pickup trucks, and vans).
                                </p>

                                <p>
                                  By default, AVERT assumes that 100% of
                                  non-electric miles travelled are powered by
                                  gasoline.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div className={clsx("flex-1", "tablet:margin-left-2")}>
                          <ImpactsTextInput
                            className={clsx(
                              "margin-top-1",
                              "tablet:margin-top-0",
                            )}
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
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of light-duty plug-in hybrid
                                  EVs to be added to the road.
                                </p>

                                <p>
                                  Light duty passenger vehicles are smaller than
                                  8,500 lb.
                                </p>

                                <p>
                                  By default, AVERT assumes that light duty
                                  vehicle efficiencies are a weighted average of
                                  40% passenger cars (which include hatchbacks,
                                  sedans, and small SUVs) and 60% passenger
                                  trucks (which include medium and large SUVs,
                                  pickup trucks, and vans).
                                </p>

                                <p>
                                  By default, AVERT assumes that 100% of
                                  non-electric miles travelled are powered by
                                  gasoline.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>
                      </div>

                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
                          <ImpactsTextInput
                            className={clsx("margin-top-1")}
                            label={<>Transit buses:</>}
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
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of electric transit buses to
                                  be added to the road.
                                </p>

                                <p>
                                  Transit buses are any buses primarily
                                  transporting passengers on fixed routes and
                                  schedules.
                                </p>

                                <p>
                                  By default, AVERT assumes that transit bus
                                  efficiencies are a weighted average of 28%
                                  medium-duty buses and 72% heavy-duty buses.
                                </p>

                                <p>
                                  By default, AVERT assumes that heavy-duty
                                  transit bus attributes are a weighted average
                                  of 81% gasoline and 19% diesel. By default,
                                  AVERT assumes that heavy-duty transit bus
                                  attributes are a weighted average of 80%
                                  diesel and 20% compressed natural gas.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div className={clsx("flex-1", "tablet:margin-left-2")}>
                          <ImpactsTextInput
                            className={clsx("margin-top-1")}
                            label={<>School buses:</>}
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
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of electric school buses to
                                  be added to the road.
                                </p>

                                <p>
                                  School buses are buses primarily transporting
                                  K-12 students between their home and school.
                                </p>

                                <p>
                                  By default, AVERT assumes that school bus
                                  efficiencies are a weighted average of 95%
                                  medium-duty buses and 5% heavy-duty buses.
                                </p>

                                <p>
                                  By default, AVERT assumes that medium-duty
                                  transit bus attributes are a weighted average
                                  of 77% diesel and 23% gasoline. By default,
                                  AVERT assumes that 100% of non-electric miles
                                  travelled by heavy-duty transit buses are
                                  powered by diesel.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>
                      </div>

                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
                          <ImpactsTextInput
                            label={<>Short-haul trucks:</>}
                            ariaLabel="Number of short-haul trucks to be added to the road"
                            value={shortHaulTrucks}
                            fieldName="shortHaulTrucks"
                            onChange={(value) => {
                              dispatch(updateEVShortHaulTrucks(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVShortHaulTrucksCalculations(value));
                            }}
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of electric short-haul trucks
                                  to be added to the road.
                                </p>

                                <p>
                                  Short-haul trucks are trucks larger than 8,500
                                  lb that drive less than or equal to 200 miles
                                  per day. Single unit trucks are vehicles on a
                                  single frame, such as a beverage or box truck.
                                  Combination trucks are vehicles with both a
                                  tractor and trailer, such as a “semi-truck.”
                                </p>

                                <p>
                                  By default, AVERT assumes that short-haul
                                  truck efficiencies are a weighted average of
                                  56% light-duty single unit trucks (e.g., those
                                  larger than 8,500 lb up to 10,000 lb), 37%
                                  medium-duty single unit trucks (e.g., those
                                  larger than 10,000 lb and up to 33,000 lb),
                                  and 7% heavy-duty combination trucks (those
                                  larger than 33,000 lb).
                                </p>

                                <p>
                                  By default, AVERT assumes that 100% of
                                  non-electric miles travelled by light-duty
                                  short-haul trucks are powered by gasoline. By
                                  default, AVERT assumes that 100% of
                                  non-electric miles travelled by heavy-duty
                                  short-haul trucks are powered by diesel. By
                                  default, AVERT assumes that medium-duty
                                  short-haul truck attributes are a weighted
                                  average of 31% gasoline and 69% diesel.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div className={clsx("flex-1", "tablet:margin-left-2")}>
                          <ImpactsTextInput
                            className={clsx(
                              "margin-top-1",
                              "tablet:margin-top-0",
                            )}
                            label={<>Combination long-haul trucks:</>}
                            ariaLabel="Number of combination long-haul trucks to be added to the road"
                            value={comboLongHaulTrucks}
                            fieldName="comboLongHaulTrucks"
                            onChange={(value) => {
                              dispatch(updateEVComboLongHaulTrucks(value));
                            }}
                            onBlur={(value) => {
                              dispatch(
                                runEVComboLongHaulTrucksCalculations(value),
                              );
                            }}
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of electric long-haul,
                                  combination trucks to be added to the road.
                                </p>

                                <p>
                                  Combination long-haul trucks are heavy-duty
                                  trucks larger than 33,000 lb that drive more
                                  than 200 miles per day. Combination trucks are
                                  vehicles with both a tractor and trailer, such
                                  as a “semi-truck.”
                                </p>

                                <p>
                                  By default, AVERT assumes that 100% of
                                  non-electric miles travelled by long-haul
                                  trucks are powered by diesel.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>
                      </div>

                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
                          <ImpactsTextInput
                            label={<>Refuse trucks:</>}
                            ariaLabel="Number of refuse to be added to the road"
                            value={refuseTrucks}
                            fieldName="refuseTrucks"
                            onChange={(value) => {
                              dispatch(updateEVRefuseTrucks(value));
                            }}
                            onBlur={(value) => {
                              dispatch(runEVRefuseTrucksCalculations(value));
                            }}
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the number of electric refuse trucks to
                                  be added to the road.
                                </p>

                                <p>
                                  Refuse trucks are trucks that collect and haul
                                  refuse to a central location.
                                </p>

                                <p>
                                  By default, AVERT assumes that refuse truck
                                  efficiencies are a weighted average of 21%
                                  medium-duty trucks (e.g., those up to 33,000
                                  lb) and 79% heavy-duty trucks (e.g., those
                                  larger than 33,000 lb). By default, AVERT
                                  assumes that 100% of non-electric miles
                                  travelled by medium- and heavy-duty refuse
                                  trucks are powered by diesel.
                                </p>
                              </>
                            }
                            errorMessage={evInputErrorMessage}
                          />
                        </div>

                        <div
                          className={clsx("flex-1", "tablet:margin-left-2")}
                        />
                      </div>
                    </div>

                    <div className={clsx("desktop:grid-col-6")}>
                      <div
                        className={clsx(
                          "margin-top-2",
                          "desktop:margin-top-0 desktop:margin-left-2",
                        )}
                      >
                        <EVSalesAndStockTable className={clsx("width-full")} />
                      </div>
                    </div>
                  </div>

                  <div className={clsx("margin-top-2", "desktop:display-flex")}>
                    <div className={clsx("flex-1", "desktop:margin-right-2")}>
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
                          <p className={clsx("margin-0")}>
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

                    <div className={clsx("flex-1", "desktop:margin-x-2")}>
                      <ImpactsSelectInput
                        className={clsx("margin-top-1", "desktop:margin-top-0")}
                        label="EV model year:"
                        ariaLabel="Model year of the modeled electric vehicles"
                        options={evModelYearOptions}
                        value={evModelYear}
                        fieldName="evModelYear"
                        onChange={(option) => {
                          dispatch(updateEVModelYear(option));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
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

                    <div className={clsx("flex-1", "desktop:margin-left-2")}>
                      <ImpactsSelectInput
                        className={clsx("margin-top-1", "desktop:margin-top-0")}
                        label="ICE vehicles being replaced:"
                        ariaLabel="EV to displace a “new” or the average “existing” internal combustion engine vehicle"
                        options={iceReplacementVehicleOptions}
                        value={iceReplacementVehicle}
                        fieldName="iceReplacementVehicle"
                        onChange={(option) => {
                          dispatch(updateEVICEReplacementVehicle(option));
                        }}
                        tooltip={
                          <p className={clsx("margin-0")}>
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

                  <EEREEVComparisonTable className={clsx("width-full")} />
                </section>
              </details>
            </div>
          </div>
        </div>

        <header
          className={clsx(
            "avert-border avert-box-background",
            "border-width-1px border-bottom-width-0 border-solid margin-top-3 padding-y-1 padding-x-105 text-bold bg-base-lightest",
          )}
        >
          <h3 className={clsx("margin-0 font-sans-xs line-height-sans-4")}>
            Energy Storage
          </h3>
        </header>

        <div className={clsx("grid-container padding-0 maxw-full")}>
          <div
            className={clsx(
              "avert-border",
              "grid-row border-width-1px border-top-width-0 border-right-width-0 border-solid",
            )}
          >
            <div
              className={clsx(
                "avert-border",
                "border-width-1px border-y-width-0 border-left-width-0 border-solid",
                "desktop:grid-col-12",
              )}
            >
              <details
                css={inputsGroupStyles}
                className={clsx(
                  "avert-border",
                  "border-width-1px border-bottom-width-0 border-x-width-0 border-solid",
                )}
                open={detailsFOpen}
                onToggle={(ev) => {
                  const details = ev.currentTarget as HTMLDetailsElement;
                  setDetailsFOpen(details.open);
                }}
              >
                <summary
                  css={inputsSummaryStyles}
                  className={clsx(
                    "avert-summary",
                    "display-flex flex-align-center padding-105 line-height-sans-2 text-bold cursor-pointer",
                  )}
                  data-label="F"
                >
                  <span className={clsx("display-none")}>F.</span>
                  PV-plus-storage
                </summary>

                <section
                  className={clsx(
                    "padding-top-0 padding-x-2 padding-bottom-105",
                  )}
                >
                  <div className={clsx("grid-row")}>
                    <div className={clsx("desktop:grid-col-6")}>
                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
                          <ImpactsTextInput
                            label={<>Utility-scale storage capacity:</>}
                            ariaLabel="Max theoretical power that the utility-scale resource can discharge"
                            suffix="MW"
                            value={utilityStorage}
                            fieldName="utilityStorage"
                            onChange={(value) => {
                              dispatch(updateESUtilityStorage(value));
                            }}
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the total capacity (maximum potential
                                  energy storage), measured in MW. To model
                                  PV-plus-storage, the user must also add some
                                  amount of utility-scale solar PV. If the solar
                                  capacity is insufficient to fully charge the
                                  battery, the battery will discharge below its
                                  full capability. AVERT Web Edition models
                                  energy storage with a midday charging pattern
                                  where the battery will start charging in
                                  mid-morning and discharge in the evening. Any
                                  electricity produced by solar above the
                                  capacity of the battery is “sent to the grid”
                                  and modeled as a reduction in fossil
                                  generation. The AVERT{" "}
                                  <a
                                    className={clsx("usa-link")}
                                    href="https://www.epa.gov/avert/download-avert"
                                    target="_parent"
                                    rel="noreferrer"
                                  >
                                    Excel Edition
                                  </a>{" "}
                                  has the ability to modify more energy storage
                                  parameters like duration, depth of discharge,
                                  round-trip efficiency, and
                                  charging/discharging profile.
                                </p>

                                <p>
                                  See Appendix K in the{" "}
                                  <a
                                    className={clsx("usa-link")}
                                    href="https://www.epa.gov/avert/avert-user-manual"
                                    target="_parent"
                                    rel="noreferrer"
                                  >
                                    AVERT user manual
                                  </a>{" "}
                                  for more details.
                                </p>
                              </>
                            }
                          />
                        </div>

                        <div className={clsx("flex-1", "tablet:margin-left-2")}>
                          <ImpactsTextInput
                            className={clsx(
                              "margin-top-1",
                              "tablet:margin-top-0",
                            )}
                            label={<>Distributed storage capacity:</>}
                            ariaLabel="Max theoretical power that the distributed resource can discharge"
                            suffix="MW"
                            value={rooftopStorage}
                            fieldName="rooftopStorage"
                            onChange={(value) => {
                              dispatch(updateESRooftopStorage(value));
                            }}
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Enter the total capacity (maximum potential
                                  energy storage), measured in MW. To model
                                  PV-plus-storage, the user must also add some
                                  amount of distributed (rooftop) solar PV. If
                                  the solar capacity is insufficient to fully
                                  charge the battery, the battery will discharge
                                  below its full capability. AVERT Web Edition
                                  models energy storage with a midday charging
                                  pattern where the battery will start charging
                                  in mid-morning and discharge in the evening.
                                  Any electricity produced by solar above the
                                  capacity of the battery is “sent to the grid”
                                  and modeled as a reduction in fossil
                                  generation. The AVERT{" "}
                                  <a
                                    className={clsx("usa-link")}
                                    href="https://www.epa.gov/avert/download-avert"
                                    target="_parent"
                                    rel="noreferrer"
                                  >
                                    Excel Edition
                                  </a>{" "}
                                  has the ability to modify more energy storage
                                  parameters like duration, depth of discharge,
                                  round-trip efficiency, and
                                  charging/discharging profile.
                                </p>

                                <p>
                                  See Appendix K in the{" "}
                                  <a
                                    className={clsx("usa-link")}
                                    href="https://www.epa.gov/avert/avert-user-manual"
                                    target="_parent"
                                    rel="noreferrer"
                                  >
                                    AVERT user manual
                                  </a>{" "}
                                  for more details.
                                </p>
                              </>
                            }
                          />
                        </div>
                      </div>

                      <div
                        className={clsx(
                          "tablet:display-flex",
                          "desktop:margin-right-2",
                        )}
                      >
                        <div
                          className={clsx("flex-1", "tablet:margin-right-2")}
                        >
                          <ImpactsSelectInput
                            className={clsx("margin-top-1")}
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
                            tooltip={
                              <>
                                <p className={clsx("margin-0")}>
                                  Select the maximum allowable number of cycles
                                  the energy storage system should discharge in
                                  a year. This number limits the numbers of days
                                  in the year when this energy storage resource
                                  will be used. AVERT models the energy storage
                                  resource on the days with the highest fossil
                                  generation on the grid, for the number of days
                                  specified.
                                </p>

                                <p>
                                  See Appendix K in the{" "}
                                  <a
                                    className={clsx("usa-link")}
                                    href="https://www.epa.gov/avert/avert-user-manual"
                                    target="_parent"
                                    rel="noreferrer"
                                  >
                                    AVERT user manual
                                  </a>{" "}
                                  for more details.
                                </p>
                              </>
                            }
                          />
                        </div>

                        <div className={clsx("flex-1", "tablet:margin-left-2")}>
                          &nbsp;
                        </div>
                      </div>
                    </div>

                    <div className={clsx("desktop:grid-col-6")}>
                      <div
                        className={clsx(
                          "margin-top-2",
                          "desktop:margin-top-0 desktop:margin-left-2",
                        )}
                      >
                        <h4
                          className={clsx(
                            "avert-blue",
                            "margin-bottom-1 font-serif-md",
                          )}
                        >
                          Storage Energy Calculated from User Inputs{" "}
                          <Tooltip>
                            <span className={clsx("text-normal")}>
                              AVERT Web Edition assumes a storage duration of
                              four hours. The modeled battery is restricted to
                              charge for four hours and then discharge for four
                              hours within each 24-hour cycle. These values are
                              based on the capacity of the battery entered by
                              the user and do not include depth of discharge and
                              round-trip efficiency loss constraints.
                            </span>
                          </Tooltip>
                        </h4>

                        <div className={clsx("overflow-auto")}>
                          <div className={clsx("avert-table-container")}>
                            <table
                              className={clsx(
                                "avert-table avert-table-striped avert-table-fixed",
                                "width-full",
                              )}
                            >
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

                  {utilityStorageError && (
                    <div
                      className={clsx(
                        "usa-alert usa-alert--slim usa-alert--error",
                      )}
                    >
                      <div className={clsx("usa-alert__body")}>
                        <p className={clsx("usa-alert__text")}>
                          Please enter some utility solar PV capacity.
                        </p>
                      </div>
                    </div>
                  )}

                  {rooftopStorageError && (
                    <div
                      className={clsx(
                        "usa-alert usa-alert--slim usa-alert--error",
                      )}
                    >
                      <div className={clsx("usa-alert__body")}>
                        <p className={clsx("usa-alert__text")}>
                          Please enter some rooftop solar PV capacity.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </details>
            </div>
          </div>
        </div>
      </div>

      <p className={clsx("margin-bottom-2 text-center")}>
        <a
          className={clsx(
            "avert-button",
            "usa-button",
            disabledButtonClassName,
          )}
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
          Energy Impacts inputs error. Please contact AVERT support at{" "}
          <a
            className={clsx("usa-link")}
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
