import { Tooltip } from 'app/components/Tooltip';

export function TransportationSectorEmissionsTable() {
  return (
    <>
      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className="avert-table width-full">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>
                  <small>From</small> Fossil Generation
                </th>
                <th>
                  <small>From</small> Vehicles
                </th>
                <th>Net Change</th>
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
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-3 text-italic">
                    Ozone season NO<sub>X</sub> <small>(lb)</small>{' '}
                    <Tooltip id="transportation-sector-ozone-season-nox-total">
                      <p className="margin-0 text-no-italic">
                        Ozone season is defined as May 1 — September 30. Ozone
                        season emissions are a subset of annual emissions.
                      </p>
                    </Tooltip>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">&nbsp;</td>
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
