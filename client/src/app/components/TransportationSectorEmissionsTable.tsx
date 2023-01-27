import { useTypedSelector } from 'app/redux/index';
import type {
  EmissionsData,
  EmissionsMonthlyData,
} from 'app/redux/reducers/results';

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
 * Sum the emissions monthly data into total annual changes for each pollutant.
 */
function setAnnualEmissionsChanges(emissionsMonthlyData: EmissionsMonthlyData) {
  if (!emissionsMonthlyData) {
    return { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 };
  }

  const { total } = emissionsMonthlyData;

  const result = Object.entries(total).reduce(
    (object, [annualKey, annualData]) => {
      const pollutant = annualKey as keyof EmissionsData;

      Object.values(annualData).forEach((monthlyData) => {
        object[pollutant] += monthlyData.postEere - monthlyData.original;
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
  const emissionsMonthlyData = useTypedSelector(
    ({ results }) => results.emissionsMonthlyData,
  );

  const annualEmissionsChanges =
    setAnnualEmissionsChanges(emissionsMonthlyData);

  const annualVehicleSO2 = -1 * totalYearlyVehicleEmissionsChanges.total.SO2;
  const annualVehicleNOX = -1 * totalYearlyVehicleEmissionsChanges.total.NOX;
  const annualVehicleCO2 = -1 * totalYearlyVehicleEmissionsChanges.total.CO2 / 2_000; // prettier-ignore
  const annualVehiclePM25 = -1 * totalYearlyVehicleEmissionsChanges.total.PM25;
  const annualVehicleVOCs = -1 * totalYearlyVehicleEmissionsChanges.total.VOCs;
  const annualVehicleNH3 = -1 * totalYearlyVehicleEmissionsChanges.total.NH3;

  const annualPowerSO2 = annualEmissionsChanges.so2;
  const annualPowerNOX = annualEmissionsChanges.nox;
  const annualPowerCO2 = annualEmissionsChanges.co2;
  const annualPowerPM25 = annualEmissionsChanges.pm25;
  const annualPowerVOCs = annualEmissionsChanges.vocs;
  const annualPowerNH3 = annualEmissionsChanges.nh3;

  if (!emissionsMonthlyData) return null;

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
                  {formatNumber(annualPowerSO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicleSO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerSO2 + annualVehicleSO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerNOX)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicleNOX)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerNOX + annualVehicleNOX)}
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
                  {formatNumber(annualPowerCO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicleCO2)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerCO2 + annualVehicleCO2)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerPM25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehiclePM25)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerPM25 + annualVehiclePM25)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerVOCs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicleVOCs)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerVOCs + annualVehicleVOCs)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerNH3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualVehicleNH3)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(annualPowerNH3 + annualVehicleNH3)}
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
