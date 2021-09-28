/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { StateChange } from 'app/redux/reducers/displacement';
// config
import { StateId } from 'app/config';

const tableContainerStyles = css`
  overflow: scroll;
`;

function formatNumber(number: number) {
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

function EmissionsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const annualStateEmissionChanges = useTypedSelector(
    ({ displacement }) => displacement.annualStateEmissionChanges,
  );

  // convert object of annual state changes to an array of changes by state
  const changesByState: StateChange[] = [];
  for (const stateId in annualStateEmissionChanges) {
    const stateChange = annualStateEmissionChanges[stateId as StateId];
    if (stateChange) changesByState.push(stateChange);
  }

  if (status !== 'complete') return null;

  return (
    <div css={tableContainerStyles}>
      <table className="avert-table">
        <thead>
          <tr>
            <th>State</th>
            <th>
              SO<sub>2</sub>
              <br />
              <small>(lb)</small>
            </th>
            <th>
              NO<sub>X</sub>
              <br />
              <small>(lb)</small>
            </th>
            <th>
              CO<sub>2</sub>
              <br />
              <small>(tons)</small>
            </th>
            <th>
              PM<sub>2.5</sub>
              <br />
              <small>(lb)</small>
            </th>
            <th>
              VOCs
              <br />
              <small>(lb)</small>
            </th>
            <th>
              NH<sub>3</sub>
              <br />
              <small>(lb)</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {changesByState
            .sort((stateA, stateB) => stateA.name.localeCompare(stateB.name))
            .map((stateData) => {
              return (
                <tr key={stateData.id}>
                  <td>{stateData.name}</td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.so2)}
                  </td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.nox)}
                  </td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.co2)}
                  </td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.pm25)}
                  </td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.vocs)}
                  </td>
                  <td className="avert-table-data">
                    {formatNumber(stateData.nh3)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default EmissionsTable;
