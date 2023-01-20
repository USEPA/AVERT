import { useTypedSelector } from 'app/redux/index';
import type { EmissionsChanges } from 'app/calculations/emissions';

function formatNumber(number: number) {
  if (number < 10 && number > -10) return '--';
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

/**
 * Sum the provided EGUs emissions data into total annual changes for each
 * pollutant.
 */
function totalEgusAnnualChanges(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) {
    return { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 };
  }

  const result = Object.values(egus).reduce(
    (object, eguData) => {
      Object.entries(eguData.data).forEach(([key, annualData]) => {
        const pollutant = key as keyof EmissionsChanges[string]['data'];

        Object.values(annualData).forEach((monthlyData) => {
          object[pollutant] += monthlyData.postEere - monthlyData.original;
        });
      });

      return object;
    },
    { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
  );

  return result;
}

export function TransportationSectorEmissionsTable() {
  const totalYearlyVehicleEmissionsChanges = useTypedSelector(
    ({ transportation }) => transportation.totalYearlyEmissionChanges,
  );
  const emissionsChanges = useTypedSelector(
    ({ results }) => results.emissionsChanges,
  );

  const totalYearlyPowerEmissionsChanges = totalEgusAnnualChanges(
    emissionsChanges.data,
  );

  const totalYearlyVehicleSO2 = -1 * totalYearlyVehicleEmissionsChanges.SO2;
  const totalYearlyVehicleNOX = -1 * totalYearlyVehicleEmissionsChanges.NOX;
  const totalYearlyVehicleCO2 = -1 * totalYearlyVehicleEmissionsChanges.CO2 / 2_000; // prettier-ignore
  const totalYearlyVehiclePM25 = -1 * totalYearlyVehicleEmissionsChanges.PM25;
  const totalYearlyVehicleVOCs = -1 * totalYearlyVehicleEmissionsChanges.VOCs;
  const totalYearlyVehicleNH3 = -1 * totalYearlyVehicleEmissionsChanges.NH3;

  const totalYearlyPowerSO2 = totalYearlyPowerEmissionsChanges.so2;
  const totalYearlyPowerNOX = totalYearlyPowerEmissionsChanges.nox;
  const totalYearlyPowerCO2 = totalYearlyPowerEmissionsChanges.co2;
  const totalYearlyPowerPM25 = totalYearlyPowerEmissionsChanges.pm25;
  const totalYearlyPowerVOCs = totalYearlyPowerEmissionsChanges.vocs;
  const totalYearlyPowerNH3 = totalYearlyPowerEmissionsChanges.nh3;

  const totalYearlyNetSO2 = totalYearlyVehicleSO2 + totalYearlyPowerSO2;
  const totalYearlyNetNOX = totalYearlyVehicleNOX + totalYearlyPowerNOX;
  const totalYearlyNetCO2 = totalYearlyVehicleCO2 + totalYearlyPowerCO2;
  const totalYearlyNetPM25 = totalYearlyVehiclePM25 + totalYearlyPowerPM25;
  const totalYearlyNetVOCs = totalYearlyVehicleVOCs + totalYearlyPowerVOCs;
  const totalYearlyNetNH3 = totalYearlyVehicleNH3 + totalYearlyPowerNH3;

  if (emissionsChanges.status !== 'success') return null;

  return (
    <>
      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className="avert-table width-full">
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
              <tr className="display-none desktop:display-table-row">
                <td colSpan={4}>&nbsp;</td>
              </tr>
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
                  {formatNumber(totalYearlyPowerSO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehicleSO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetSO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyPowerNOX)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehicleNOX)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetNOX)}
                </td>
              </tr>

              <tr className="display-none desktop:display-table-row">
                <td colSpan={4}>&nbsp;</td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyPowerCO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehicleCO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetCO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyPowerPM25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehiclePM25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetPM25)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyPowerVOCs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehicleVOCs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetVOCs)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyPowerNH3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyVehicleNH3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(totalYearlyNetNH3)}
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
