import { useTypedSelector } from 'app/redux/index';

function formatNumber(number: any) {
  if (number < 10 && number > -10) return '--';
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

export function TransportationSectorEmissionsTable() {
  const totalYearlyEmissionChanges = useTypedSelector(
    ({ transportation }) => transportation.totalYearlyEmissionChanges,
  );

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
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.SO2)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.NOX)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
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
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.CO2)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.PM25)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.VOCs)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {formatNumber(-1 * totalYearlyEmissionChanges.NH3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
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
