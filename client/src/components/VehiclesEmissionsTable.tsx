import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tooltip } from "@/components/Tooltip";
import { useAppSelector } from "@/redux/index";
import { type SelectedRegionsYearlyEmissionChangesTotals } from "@/calculations/transportation";
import { type CombinedSectorsEmissionsData } from "@/calculations/emissions";
import { type EmptyObject } from "@/utilities";

/**
 * Round number to the nearest 10 and conditionally display "—" if number is
 * within 10 of zero.
 */
function formatNumber(number: number) {
  if (number !== 0 && number < 10 && number > -10) return "—";
  const result = Math.round(number / 10) * 10;
  return result.toLocaleString();
}

/**
 * Calculate the annual power sector emissions changes for each pollutant.
 */
function setAnnualPowerEmissionsChanges(options: {
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData;
}) {
  const { combinedSectorsEmissionsData } = options;

  if (!combinedSectorsEmissionsData) {
    return { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 };
  }

  const result = Object.entries(combinedSectorsEmissionsData.total).reduce(
    (object, [key, value]) => {
      const pollutant = key as keyof typeof combinedSectorsEmissionsData.total;
      const totalPowerData = value.power;

      if (totalPowerData) {
        const { original, postEere } = totalPowerData.annual;
        object[pollutant] += postEere - original;
      }

      return object;
    },
    { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
  );

  return result;
}

/**
 * Build up the annual transportation sector emissions changes for each
 * pollutant by summing each pollutant's emissions changes for each selected
 * AVERT region.
 */
function setAnnualVehicleEmissionsChanges(options: {
  selectedRegionsYearlyEmissionChangesTotals:
    | SelectedRegionsYearlyEmissionChangesTotals
    | EmptyObject;
}) {
  const { selectedRegionsYearlyEmissionChangesTotals } = options;

  if (Object.keys(selectedRegionsYearlyEmissionChangesTotals).length === 0) {
    return { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 };
  }

  const result = Object.values(
    selectedRegionsYearlyEmissionChangesTotals,
  ).reduce(
    (object, regionChanges) => {
      Object.entries(regionChanges).forEach(
        ([regionChangesKey, regionChangesValue]) => {
          const pollutant = regionChangesKey as keyof typeof regionChanges;
          const value = -1 * regionChangesValue;

          /** conditionally convert co2 pounds into tons */
          const result = pollutant === "co2" ? value / 2_000 : value;

          object[pollutant] += result;
        },
      );

      return object;
    },
    { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
  );

  return result;
}

function VehiclesEmissionsTableContent() {
  const selectedRegionsYearlyEmissionChangesTotals = useAppSelector(
    ({ transportation }) =>
      transportation.selectedRegionsYearlyEmissionChangesTotals,
  );
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const combinedSectorsEmissionsData = useAppSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

  const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = inputs;

  const evInputsEmpty =
    (batteryEVs === "" || batteryEVs === "0") &&
    (hybridEVs === "" || hybridEVs === "0") &&
    (transitBuses === "" || transitBuses === "0") &&
    (schoolBuses === "" || schoolBuses === "0");

  const annualPower = setAnnualPowerEmissionsChanges({
    combinedSectorsEmissionsData,
  });

  const annualVehicle = setAnnualVehicleEmissionsChanges({
    selectedRegionsYearlyEmissionChangesTotals,
  });

  if (!combinedSectorsEmissionsData) return null;

  if (evInputsEmpty) {
    return (
      <div className={clsx("grid-col-12")}>
        <div className={clsx("avert-box", "padding-3")}>
          <p className={clsx("margin-0 font-sans-xs text-center")}>
            <strong>No electric vehicles inputs entered.</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={clsx("overflow-auto")}>
        <div className={clsx("avert-table-container")}>
          <table
            className={clsx("avert-table avert-table-striped", "width-full")}
          >
            <thead>
              <tr>
                <td>&nbsp;</td>
                <th className={clsx("text-right")} scope="col">
                  <small>From</small> Fossil Generation&nbsp;
                  <Tooltip reversed>
                    <p className={clsx("margin-0 text-normal text-left")}>
                      This column shows the annual emissions impacts from the
                      electric power sector. This column includes emissions
                      changes from fossil fuel power plants that are affected by
                      the combined load change from all modeled resources,
                      including energy efficiency, renewable energy, electric
                      vehicle charging load, and energy storage.
                    </p>
                  </Tooltip>
                </th>
                <th className={clsx("text-right")} scope="col">
                  <small>From</small> Vehicles&nbsp;
                  <Tooltip reversed>
                    <p className={clsx("margin-0 text-normal text-left")}>
                      This column shows the annual avoided emissions from
                      internal combustion engine vehicles displaced due to the
                      addition of electric vehicles defined in the scenario.
                      Avoided vehicle emissions refers to emissions from vehicle
                      tailpipes and other emissions closely related to the
                      driving and fueling of vehicles.
                    </p>
                  </Tooltip>
                </th>
                <th className={clsx("text-right")} scope="col">
                  Net Change
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th className={clsx("text-bold")} scope="row" colSpan={4}>
                  Total Emissions
                </th>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    SO<sub>2</sub> <small>(lb)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.so2)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.so2)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.so2 + annualVehicle.so2)}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.nox)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.nox)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.nox + annualVehicle.nox)}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    CO<sub>2</sub> <small>(tons)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.co2)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.co2)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.co2 + annualVehicle.co2)}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.pm25)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.pm25)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.pm25 + annualVehicle.pm25)}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    VOCs <small>(lb)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.vocs)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.vocs)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.vocs + annualVehicle.vocs)}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <span className={clsx("padding-left-105")}>
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </th>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.nh3)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualVehicle.nh3)}
                </td>
                <td className={clsx("font-mono-xs text-right")}>
                  {formatNumber(annualPower.nh3 + annualVehicle.nh3)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul
        className={clsx(
          "margin-top-2 margin-bottom-0 font-sans-3xs line-height-sans-3 text-base-dark",
        )}
      >
        <li>Negative numbers indicate displaced generation and emissions.</li>
        <li>
          All results are rounded to the nearest 10. A dash
          (“&thinsp;—&thinsp;”) indicates non-zero results, but within +/- 10
          units.
        </li>
        <li>
          Fossil results include combined changes from all modeled resources
          (including EVs).
        </li>
      </ul>

      <p className={clsx("display-none")}>
        {/* NOTE: hidden paragraph is intentional to get around EPA's
         * `ul:last-child { margin-bottom: revert; }` style
         */}
      </p>
    </>
  );
}

export function VehiclesEmissionsTable() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading transportation sector emissions table. Please contact
          AVERT support at{" "}
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
      <VehiclesEmissionsTableContent />
    </ErrorBoundary>
  );
}
