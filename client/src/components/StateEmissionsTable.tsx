import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppSelector } from "@/redux/index";
import { type CombinedSectorsEmissionsData } from "@/calculations/emissions";
import { type StateId, states as statesConfig } from "@/config";

/**
 * Round number to the nearest 10 and conditionally format resulting -0 to 0.
 */
function formatNumber(number: number) {
  const result = Math.round(number / 10) * 10;
  return (result + 0).toLocaleString();
}

/**
 * Format the state emissions data from the power and transportation sectors for
 * easier use in displaying in a table.
 */
function setAnnualStateEmissionsChanges(
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData,
) {
  if (!combinedSectorsEmissionsData) return [];

  const stateEmissionsData = combinedSectorsEmissionsData.states;

  const result = Object.entries(stateEmissionsData).reduce(
    (array, [key, stateData]) => {
      const stateId = key as keyof typeof stateEmissionsData;
      const stateName = statesConfig[stateId].name;

      const { power, vehicle } = Object.entries(stateData).reduce(
        (object, [stateDataKey, stateDataValue]) => {
          const pollutant = stateDataKey as keyof typeof stateData;
          const statePowerData = stateDataValue.power;
          const stateVehicleData = stateDataValue.vehicle;

          if (pollutant !== "generation" && pollutant !== "heat") {
            if (statePowerData !== null) {
              const { pre, post } = statePowerData.annual;
              object.power[pollutant] += post - pre;
            }

            if (stateVehicleData !== null) {
              object.vehicle[pollutant] = stateVehicleData.annual;
            }
          }

          return object;
        },
        {
          power: { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
          vehicle: { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
        },
      );

      if (stateName) {
        array.push({ id: stateId, name: stateName, power, vehicle });
      }

      return array;
    },
    [] as {
      id: StateId;
      name: string;
      power: { so2: number; nox: number; co2: number; pm25: number; vocs: number; nh3: number }; // prettier-ignore
      vehicle: { so2: number; nox: number; co2: number; pm25: number; vocs: number; nh3: number }; // prettier-ignore
    }[],
  );

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

function StateEmissionsTableContent() {
  const combinedSectorsEmissionsData = useAppSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

  const annualStateEmissionsChanges = setAnnualStateEmissionsChanges(
    combinedSectorsEmissionsData,
  );

  const [selectedStates, setSelectedStates] = useState<
    typeof annualStateEmissionsChanges
  >([]);

  useEffect(() => {
    if (
      annualStateEmissionsChanges.length === 0 &&
      selectedStates.length !== 0
    ) {
      setSelectedStates([]);
    }
  }, [annualStateEmissionsChanges, selectedStates]);

  if (!combinedSectorsEmissionsData) return null;

  const allStatesSelected =
    annualStateEmissionsChanges.length === selectedStates.length;

  return (
    <>
      <div
        className={clsx(
          "margin-bottom-2 flex-align-center",
          "mobile-lg:display-flex",
        )}
      >
        <div className={clsx("flex-1", "mobile-lg:margin-right-1")}>
          <Select
            className={clsx("avert-select")}
            classNamePrefix="avert-select"
            placeholder="Select States"
            isMulti={true}
            value={selectedStates}
            options={annualStateEmissionsChanges}
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            onChange={(options) => {
              const states = Array.isArray(options)
                ? (options as typeof annualStateEmissionsChanges)
                : [];
              setSelectedStates(states);
            }}
          />
        </div>

        <div className={clsx("mobile-lg:margin-left-1")}>
          <div className={clsx("usa-checkbox")}>
            <input
              id="all-states"
              className={clsx("usa-checkbox__input")}
              type="checkbox"
              name="states"
              value="all"
              checked={allStatesSelected}
              onChange={(_ev) => {
                const states = allStatesSelected
                  ? []
                  : annualStateEmissionsChanges;
                setSelectedStates(states);
              }}
            />
            <label
              className={clsx("usa-checkbox__label", "mobile-lg:margin-top-0")}
              htmlFor="all-states"
            >
              All states
            </label>
          </div>
        </div>
      </div>

      {selectedStates.length === 0 ? (
        <div className={clsx("grid-col-12 margin-bottom-2")}>
          <div className={clsx("avert-box", "padding-3")}>
            <p className={clsx("margin-0 font-sans-xs text-center")}>
              <strong>No states selected.</strong>
              <br />
              Please select one or more states.
            </p>
          </div>
        </div>
      ) : (
        <div className={clsx("overflow-auto")}>
          <div className={clsx("avert-table-container")}>
            <table className={clsx("avert-table", "width-full")}>
              <thead>
                <tr>
                  <th scope="col" colSpan={2}>
                    State
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    SO<sub>2</sub> <small>(lb)</small>
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    NO<sub>X</sub> <small>(lb)</small>
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    CO<sub>2</sub> <small>(tons)</small>
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    VOCs <small>(lb)</small>
                  </th>
                  <th className={clsx("text-right")} scope="col">
                    NH<sub>3</sub> <small>(lb)</small>
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedStates.map((data, index, array) => {
                  /** apply zebra striping to groups of state data rows */
                  const stripedRowClassName =
                    index % 2 ? "" : "avert-table-striped-row";

                  /** add visual space below the last state row, unless its the last state */
                  const stateSpacingClassName =
                    index !== array.length - 1
                      ? "border-width-1 border-top-width-0 border-x-width-0 border-solid border-white"
                      : "";

                  return (
                    <Fragment key={data.id}>
                      <tr className={clsx(stripedRowClassName)}>
                        <th scope="row" rowSpan={3}>
                          {data.name}
                        </th>
                        <th
                          scope="row"
                          className={clsx("width-1px text-no-wrap text-right")}
                        >
                          <small>From</small> Fossil Generation
                        </th>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.so2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.nox)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.co2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.pm25)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.vocs)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.nh3)}
                        </td>
                      </tr>

                      <tr className={clsx(stripedRowClassName)}>
                        <th
                          scope="row"
                          className={clsx("width-1px text-no-wrap text-right")}
                        >
                          <small>From</small> Vehicles
                        </th>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.so2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.nox)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.co2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.pm25)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.vocs)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.vehicle.nh3)}
                        </td>
                      </tr>

                      <tr
                        className={clsx(
                          stripedRowClassName,
                          stateSpacingClassName,
                        )}
                      >
                        <th
                          scope="row"
                          className={clsx("width-1px text-no-wrap text-right")}
                        >
                          Net Change
                        </th>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.so2 + data.vehicle.so2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.nox + data.vehicle.nox)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.co2 + data.vehicle.co2)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.pm25 + data.vehicle.pm25)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.vocs + data.vehicle.vocs)}
                        </td>
                        <td className={clsx("font-mono-xs text-right")}>
                          {formatNumber(data.power.nh3 + data.vehicle.nh3)}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export function StateEmissionsTable() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading state emissions table. Please contact AVERT support at{" "}
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
      <StateEmissionsTableContent />
    </ErrorBoundary>
  );
}
