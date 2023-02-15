import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
import type { SelectedRegionsTotalYearlyEmissionChanges } from 'app/calculations/transportation';
import type { CombinedSectorsEmissionsData } from 'app/calculations/emissions';

/**
 * Round number to the nearest 10 and conditionally display '--' if number is
 * within 10 of zero.
 */
function formatNumber(number: number) {
  if (number < 10 && number > -10) return '--';
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
 * Calculate the annual transportation sector emissions changes for each
 * pollutant.
 */
function setAnnualVehicleEmissionsChanges(options: {
  selectedRegionsTotalYearlyEmissionChanges: SelectedRegionsTotalYearlyEmissionChanges | {} // prettier-ignore
}) {
  const { selectedRegionsTotalYearlyEmissionChanges } = options;

  const selectedRegionsChangesData =
    Object.keys(selectedRegionsTotalYearlyEmissionChanges).length !== 0
      ? (selectedRegionsTotalYearlyEmissionChanges as SelectedRegionsTotalYearlyEmissionChanges)
      : null;

  if (!selectedRegionsChangesData) {
    return { SO2: 0, NOX: 0, CO2: 0, PM25: 0, VOCs: 0, NH3: 0 };
  }

  const result = Object.values(selectedRegionsChangesData).reduce(
    (object, regionChanges) => {
      ['CO2', 'NOX', 'SO2', 'PM25', 'VOCs', 'NH3'].forEach((item) => {
        const pollutant = item as keyof typeof regionChanges.total;
        const value = -1 * regionChanges.total[pollutant];
        // conditionally convert CO2 tons into pounds
        const result = pollutant === 'CO2' ? value / 2_000 : value;

        object[pollutant] += result;
      });

      return object;
    },
    { SO2: 0, NOX: 0, CO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
  );

  return result;
}

function VehiclesEmissionsTableContent() {
  const selectedRegionsTotalYearlyEmissionChanges = useTypedSelector(
    ({ transportation }) =>
      transportation.selectedRegionsTotalYearlyEmissionChanges,
  );
  const combinedSectorsEmissionsData = useTypedSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

  const annualPower = setAnnualPowerEmissionsChanges({
    combinedSectorsEmissionsData,
  });

  const annualVehicle = setAnnualVehicleEmissionsChanges({
    selectedRegionsTotalYearlyEmissionChanges,
  });

  if (!combinedSectorsEmissionsData) return null;

  return (
    <>
      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className="avert-table avert-table-striped width-full">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th className="text-right">
                  <small>From</small> Fossil Generation
                </th>
                <th className="text-right">
                  <small>From</small> Vehicles
                </th>
                <th className="text-right">Net Change</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={4} className="text-bold">
                  Total Emissions
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    SO<sub>2</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.so2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.SO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.so2 + annualVehicle.SO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.nox)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.NOX)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.nox + annualVehicle.NOX)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.co2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.CO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.co2 + annualVehicle.CO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.pm25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.PM25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.pm25 + annualVehicle.PM25)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.vocs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.VOCs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.vocs + annualVehicle.VOCs)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.nh3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicle.NH3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPower.nh3 + annualVehicle.NH3)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul className="margin-top-2 margin-bottom-0 font-sans-3xs line-height-sans-3 text-base-dark">
        <li>Negative numbers indicate displaced generation and emissions.</li>
        <li>All results are rounded to the nearest ten.</li>
        <li>
          A dash (“–”) indicates a result greater than zero, but lower than the
          level of reportable significance.
        </li>
        <li>
          Fossil results include combined changes from all modeled resources
          (including EVs).
        </li>
      </ul>

      <p className="display-none">
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
          AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <VehiclesEmissionsTableContent />
    </ErrorBoundary>
  );
}
